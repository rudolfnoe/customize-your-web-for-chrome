Array.prototype.replace = function(oldObj, newObj){
   var indexOfOldItem = this.indexOf(oldObj)
   if(indexOfOldItem==-1){
      throw new Error("oldObj not in list")
   }
   this[indexOfOldItem] = newObj
   return oldObj
};

Array.prototype._checkIndexInRange = function(index){
   if(index<0 || index>=this.length)
      throw new Error('IndexOutOfBounds')
};

Array.prototype.set = function(index, obj){
   this._checkIndexInRange(index)
   this[index] = obj
};

Array.prototype.contains = function(obj, compareFunc){
   if(compareFunc){
      return this.some(function(element, index, array){
         return compareFunc(obj, element)
      })
   }else{
      return this.indexOf(obj)!=-1
   }
};

Array.prototype.removeAtIndex = function(index){
   this._checkIndexInRange(index)
   var removedObj = this[index];
   return this.slice(0,index).concat(this.slice(index+1))
};