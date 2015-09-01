
unredo = function(local, container){
  if(local == true){
    this.undoStack = [];
    this.redoStack = [];
    this.position = 0;
  }
  this.container = container;
  this.setUI();
}
unredo.prototype.undoStack = [];
unredo.prototype.redoStack = [];
unredo.prototype.undoPosition = 0;
unredo.prototype.redoPosition = 0;
unredo.prototype.setUI = function(){
  var scope = this;
  $(this.container).on("keydown.unredo", function(e){
    if(e.metaKey || e.ctrlKey){
      if(e.which == 90){
        scope.fetchLastAction();
      }
      if(e.which == 89){
        scope.redoLastAction();
      }
    }
  });
}
unredo.prototype.addAction = function(object, method, state){
  this.undoStack.push([object, method, state]);
  this.redoStack = [];
  this.redoPosition = 0;
}

unredo.prototype.fetchLastAction = function(){
  if(this.undoStack.length>0){
    this.undoPosition = this.undoStack.length-1;
    var floatAction = this.undoStack[this.undoPosition];
    this.redoStack.push(floatAction);
    this.undoStack.pop();
    floatAction[2].redo = false;
    this._onunredointernal("undo", floatAction);
  }else{
    this._onunredointernal("undo", null);
  }
}

unredo.prototype.redoLastAction = function(){
  if(this.redoStack.length>0){
    this.redoPosition = this.redoStack.length-1;
    var floatAction = this.redoStack[this.redoPosition];
    this.undoStack.push(floatAction);
    this.redoStack.pop();
    floatAction[2].redo = true;
    this._onunredointernal("redo", floatAction);
  }else{
    this._onunredointernal("redo", null);
  }
}
unredo.prototype._onunredointernal = function(state, object){
  if(this.onUnredo != undefined && typeof this.onUnredo == "function"){
    this.onUnredo(state,object);
  }
}
