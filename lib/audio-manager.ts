class AudioManager{
 private enabled=true;
 private play(path:string,volume=.45){
  if(typeof window==="undefined"||!this.enabled)return;
  const audio=new Audio(path);audio.volume=volume;audio.preload="auto";
  void audio.play().catch(()=>{});
 }
 setEnabled(value:boolean){this.enabled=value}
 provinceSelected(){this.play("/audio/click.mp3",.38)}
 menuOpened(){this.play("/audio/radio.mp3",.32)}
 technologySelected(){this.play("/audio/click.mp3",.3)}
 message(){this.play("/audio/radio.mp3",.28)}
 alert(){this.play("/audio/radio.mp3",.36)}
}
export const audioManager=new AudioManager();
