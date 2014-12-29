
// STRICT MODE
// ================================================================================================
   "use strict";
// ================================================================================================


// GLOBAL :: for syntactic reference
// ========================================================================================================
   if (!global)
   { var global = window; }
// ========================================================================================================


// IDENTIFIES A VARIABLE
// ========================================================================================================
   global.typeOf = function(dfn)
   {
      var tpe = (typeof arg).toLowerCase();

      if ((tpe == 'number') && (isNaN(dfn)))
      { tpe = 'nan'; }
      else
      { tpe = ({}).toString.call(dfn).match(/\s([a-zA-Z]+)/)[1].toLowerCase(); }

      return tpe;
   };
// ========================================================================================================


// MODULE :: for modular JavaScript
// ========================================================================================================
   global.Module = function()
   {
      this.rootDir = '/mod';
      this.extName = 'js';

      var imports = function(str, __fileName)
      {
         var module = {exports:null};
         var exports = {};

         try{ eval(str); }
         catch(e)
         {
            var errFile = (function()
            {
               var pts = __fileName.split('/');
               return pts[pts.length -1];
            }());

            if (e.stack.indexOf('<anonymous>:') > 0)
            { var errLine = e.stack.split("\n")[1].split('<anonymous>:')[1].split(')')[0].substr(0,1); }
            else
            { var errLine = '0'; }

            console.error('%c '+e.name+"\t"+e.message+"\t\t"+errFile+':'+errLine, 'color: #f00');

            return;
         }

         if (typeOf(module.exports) == 'undefined')
         { return module; }

         if (module.exports !== null)
         { return module.exports; }

         if (Object.keys(exports).length > 0)
         { return exports; }
      }

      Object.defineProperty(this, 'src',
      {
         writeable:true,
         enumerable:false,
         configurable:true,
         set:function(dfn)
         {
            var tmp, rsl, ldd, pth, cbf=null, xhr=[], mod=this, asn=false;

            if (typeOf (mod.onload) == 'function')
            {
               cbf = mod.onload;
               asn = true;
            }

            if (typeOf(dfn) == 'string')
            { dfn = [dfn]; }

            if (typeOf(dfn) == 'array')
            {
               tmp = {};

               for (var i in dfn)
               { tmp[dfn[i]] = mod.rootDir+'/'+dfn[i]; }

               dfn = tmp;
            }

            if (typeOf(dfn) != 'object')
            {
               throw new TypeError('string, array[string], or object{baseName:dirPath} expected');
               return;
            }

            ldd=[0,dfn.length];

            for (var i in dfn)
            {
               pth = dfn[i]+'.'+mod.extName;

               xhr[i] = new XMLHttpRequest();

               xhr[i].onload = function()
               {
                  if (xhr[i].status !== 200)
                  {
                     throw new ReferenceError(xhr[i].status);
                     return;
                  }

                  mod.module = imports(xhr[i].responseText, pth);

                  ldd[0]++;

                  if (ldd[0] == ldd[1])
                  {
                     if (cbf !== null)
                     { cbf(mod.module); }
                  }
               }

               xhr[i].open('GET', pth, asn);
               xhr[i].send(null);
            }
         }
      });
   };
// ========================================================================================================


// IMPORT :: for quick module definition
// ========================================================================================================
   global.Import = function()
   {
      var dfn = [].slice.call(arguments);
      var cbf = null;

      if (typeOf(dfn[0]) == 'array')
      {
         if (typeOf(dfn[1]) == 'function')
         { cbf = dfn[1]; }

         dfn = dfn[0];
      }

      if (typeOf(dfn[dfn.length -1]) == 'function')
      { cbf = dfn.pop(); }

      var rsl = new Module();

      if (cbf !== null)
      { rsl.onload = cbf; }

      rsl.src = dfn;

      if (cbf === null)
      { return rsl.module; }
   };
// ========================================================================================================


// REQUIRE :: for convenience
// ========================================================================================================
   global.require = Import;
// ========================================================================================================
