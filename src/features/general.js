//Taken from https://github.com/sweaver2112/LinkedIn-dark-theme-hack
const colors = `:root{--black:#000;--black-a90:rgba(0,0,0,0.9);--black-a75:rgba(0,0,0,0.75);--black-a60:rgba(0,0,0,0.6);--black-a45:rgba(0,0,0,0.45);--black-a30:rgba(0,0,0,0.3);--black-a15:rgba(0,0,0,0.15);--black-a12:rgba(0,0,0,0.12);--black-a08:rgba(0,0,0,0.08);--black-a04:rgba(0,0,0,0.04);--white:#fff;--white-a90:hsla(0,0%,100%,0.9);--white-a85:hsla(0,0%,100%,0.85);--white-a70:hsla(0,0%,100%,0.7);--white-a55:hsla(0,0%,100%,0.55);--white-a40:hsla(0,0%,100%,0.4);--white-a25:hsla(0,0%,100%,0.25);--white-a18:hsla(0,0%,100%,0.18);--white-a12:hsla(0,0%,100%,0.12);--white-a06:hsla(0,0%,100%,0.06);--blue-10:#f6fbff;--blue-20:#e8f3ff;--blue-30:#d0e8ff;--blue-40:#a8d4ff;--blue-50:#70b5f9;--blue-50-a20:rgba(112,181,249,0.2);--blue-50-a30:rgba(112,181,249,0.3);--blue-60:#378fe9;--blue-70:#0a66c2;--blue-80:#004182;--blue-90:#09223b;--cool-gray-10:#f9fafb;--cool-gray-20:#eef3f8;--cool-gray-30:#dce6f1;--cool-gray-40:#c0d1e2;--cool-gray-50:#9db3c8;--cool-gray-60:#788fa5;--cool-gray-70:#56687a;--cool-gray-80:#38434f;--cool-gray-90:#1d2226;--warm-gray-10:#fafaf9;--warm-gray-20:#f3f2ef;--warm-gray-30:#e9e5df;--warm-gray-40:#d6cec2;--warm-gray-50:#b9af9f;--warm-gray-60:#958b7b;--warm-gray-70:#6e6558;--warm-gray-80:#474139;--warm-gray-90:#211f1c;--warm-red-10:#fff9f7;--warm-red-20:#ffefea;--warm-red-30:#ffded5;--warm-red-40:#fdc2b1;--warm-red-50:#f5987e;--warm-red-60:#e16745;--warm-red-70:#b24020;--warm-red-80:#762812;--warm-red-90:#351a12;--teal-10:#eefdff;--teal-20:#d5f9fe;--teal-30:#aef0fa;--teal-40:#79deee;--teal-50:#44bfd3;--teal-50-a30:rgba(68,191,211,0.3);--teal-60:#2199ac;--teal-70:#13707e;--teal-80:#104952;--teal-90:#0e2428;--purple-10:#fcf9ff;--purple-20:#f7efff;--purple-30:#eedfff;--purple-40:#dec5fd;--purple-40-a15:rgba(222,197,253,0.15);--purple-50:#c79ef7;--purple-60:#a872e8;--purple-70:#8344cc;--purple-70-a15:rgba(131,68,204,0.15);--purple-80:#592099;--purple-90:#2c1349;--system-red-10:#fff9f9;--system-red-20:#ffeeef;--system-red-30:#ffddde;--system-red-40:#ffbfc1;--system-red-50:#fc9295;--system-red-60:#f55257;--system-red-70:#cc1016;--system-red-80:#8a0005;--system-red-90:#46080a;--system-green-10:#f0fdf7;--system-green-20:#dbf9eb;--system-green-30:#b6f2d6;--system-green-40:#7ce3b3;--system-green-50:#3ec786;--system-green-60:#13a05f;--system-green-70:#057642;--system-green-80:#004d2a;--system-green-90:#022716;--pink-10:#fff8ff;--pink-20:#ffedfe;--pink-30:#ffdafd;--pink-40:#fcb9f9;--pink-50:#f489ee;--pink-60:#dd51d6;--pink-70:#b11faa;--pink-80:#770c72;--pink-90:#3d0a3b;--amber-10:#fdfaf5;--amber-20:#fbf1e2;--amber-30:#fce2ba;--amber-40:#f8c77e;--amber-50:#e7a33e;--amber-60:#c37d16;--amber-70:#915907;--amber-80:#5d3b09;--amber-90:#2a1f0e;--copper-10:#fcfaf9;--copper-20:#fcf0ed;--copper-30:#fadfd8;--copper-40:#f2c5b8;--copper-50:#e0a191;--copper-60:#be7b6a;--copper-70:#8f5849;--copper-80:#5d392f;--copper-90:#2d1d19;--green-10:#f6fcf4;--green-20:#e3f9d8;--green-30:#c7f1b2;--green-40:#a5df89;--green-50:#7fc15e;--green-60:#5f9b41;--green-70:#44712e;--green-80:#2f4922;--green-90:#1b2416;--sage-10:#f8fbf6;--sage-20:#eaf6e4;--sage-30:#d7ebce;--sage-40:#bdd7b0;--sage-50:#9db88f;--sage-60:#7b9370;--sage-70:#5a6b51;--sage-80:#3a4535;--sage-90:#1e221c;--lime-10:#f9fce9;--lime-20:#eff8b9;--lime-30:#dfee89;--lime-40:#c6d957;--lime-50:#a6ba32;--lime-60:#83941f;--lime-70:#5f6c16;--lime-80:#3e4613;--lime-90:#20230f;--camo-10:#fafbf3;--camo-20:#f1f4e4;--camo-30:#e4e8cc;--camo-40:#cdd3ac;--camo-50:#aeb48a;--camo-60:#8a8f6c;--camo-70:#65684e;--camo-80:#414335;--camo-90:#21211d;--smoke-10:#f8fafb;--smoke-20:#edf3f4;--smoke-30:#dbe7e9;--smoke-40:#bfd3d6;--smoke-50:#a0b4b7;--smoke-60:#7d8f92;--smoke-70:#5b696b;--smoke-80:#3c4345;--smoke-90:#1f2122;--lavender-10:#fbf9fd;--lavender-20:#f4f1f9;--lavender-30:#eae2f3;--lavender-40:#d7cae7;--lavender-50:#bba9d1;--lavender-60:#9983b1;--lavender-70:#715e86;--lavender-80:#493d57;--lavender-90:#241f29;--mauve-10:#fcf9fc;--mauve-20:#f9eff8;--mauve-30:#f2e0f1;--mauve-40:#e5c6e3;--mauve-50:#cea2cc;--mauve-60:#ac7da9;--mauve-70:#80597e;--mauve-80:#523a51;--mauve-90:#271e27;--system-gray-10:#fafafa;--system-gray-20:#f2f2f2;--system-gray-30:#e5e5e5;--system-gray-40:#cfcfcf;--system-gray-50:#b0b0b0;--system-gray-60:#8c8c8c;--system-gray-70:#666;--system-gray-80:#424242;--system-gray-90:#212121;--system-orange-10:#fff9f6;--system-orange-20:#ffefe8;--system-orange-30:#ffdfd1;--system-orange-40:#ffc1a7;--system-orange-50:#ff9466;--system-orange-60:#eb6126;--system-orange-70:#b93a04;--system-orange-80:#792603;--system-orange-90:#351a0f;--transparent:transparent;--transparent-white:hsla(0,0%,100%,0);`
const addendum = `--color-background-brand-accent-4: var(--cool-gray-90);`

const enableDarkMode = () => {
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
  const style = document.createElement('style')
  const shift255 = (num) => {
    return (parseInt(num) + rand(220, 255)) % 256
  }
  style.innerHTML = colors
    .replace(/100%|0%/g, (m) => {
      return m == '100%' ? '0%' : '100%'
    })
    .replace(/#000|#fff/g, (m) => {
      return m == '#fff' ? '#000' : '#fff'
    })
    .replace(/#([fe])(.)([fe])(.)([fe])(.)/g, `#1$21$41$6`)
    .replace(/\d+(?=,)/g, (m) => {
      return shift255(m)
    })
  style.innerHTML += addendum

  document.body.appendChild(style)
}

const disableDarkMode = () => {
  const style = document.createElement('style')
  style.innerHTML = colors
  document.body.appendChild(style)
}

let wideModeDiv

const enableWideMode = () => {
  wideModeDiv =
    document.getElementsByClassName(
      'scaffold-layout__inner scaffold-layout-container scaffold-layout-container--reflow'
    )[0] || wideModeDiv
  if (wideModeDiv) wideModeDiv.classList.add('wide-mode')
}

const disableWideMode = () => {
  if (wideModeDiv) wideModeDiv.classList.remove('wide-mode')
}

const handleDarkMode = (getRes) => {
  // Set wide mode
  if (getRes('dark-mode', true)) {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
}

const handleWideMode = (getRes) => {
  if (getRes('wide-mode', true)) {
    enableWideMode()
  } else {
    disableWideMode()
  }
}

export default (getRes) => {
  handleWideMode(getRes)
  handleDarkMode(getRes)
}
