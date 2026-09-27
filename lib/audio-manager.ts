class AudioManager{private ctx:AudioContext|null=null;private context(){if(typeof window==="undefined")return null;this.ctx??=new AudioContext();return this.ctx}
private tone(freq:number,duration:number,type:OscillatorType="sine"){const c=this.context();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.045,c.currentTime+.008);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration+.02)}
provinceSelected(){this.tone(95,.06,"sawtooth");window.setTimeout(()=>this.tone(440,.08,"square"),45)}
alert(){this.tone(180,.08,"square");window.setTimeout(()=>this.tone(120,.1,"square"),90)}
}
export const audioManager=new AudioManager();
