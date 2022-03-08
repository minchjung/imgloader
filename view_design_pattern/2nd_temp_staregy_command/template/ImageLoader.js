const ImageLoader = class extends Github{ // 실행시점 = 변하는 부분 
  constructor(id, repo, target){
    super(id, repo);
    this._target = target;
  }

  // 위임 구현 
  _loaded(v){
    this._target.src = 'data:text/plain;base64, ' + v;
  }
}