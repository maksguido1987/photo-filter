const inputs = document.querySelectorAll('input[type="range"]');
const image = document.querySelector('img');
const filters = document.querySelector('.filters');
const resetBtn = document.querySelector('.btn-reset');
const loadBtn = document.querySelector('.btn-load--input');
const saveBtn = document.querySelector('.btn-save');
const fullScreenBtn = document.querySelector('.fullscreen');
//currentSrc baseURI getComputedStyle()

function viewBgImage(src) {
  image.src = src;
  image.onload = () => {
    image.src = src;
  };
}

// UPDATE
function handleUpdate(e) {
  const ending = e.target.dataset.sizing || '';
  const inputName = e.target.name;
  const inputActive = e.target;
  const inputValue = inputActive.value;

  inputActive.nextElementSibling.textContent = inputValue;
  image.style.setProperty(`--${inputName}`, `${inputValue}${ending}`);
}
filters.addEventListener('input', handleUpdate);

// SAVE PICTURE
function savePicture() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const newImage = new Image();

  const blurValue = document.querySelector('input[name="blur"]').value;
  const invertValue = document.querySelector('input[name="invert"]').value;
  const sepiaValue = document.querySelector('input[name="sepia"]').value;
  const saturateValue = document.querySelector('input[name="saturate"]').value;
  const hueValue = document.querySelector('input[name="hue"]').value;
  let cof;

  if (image.naturalWidth > image.naturalHeight) {
    cof = image.naturalWidth / image.width;
  } else {
    cof = image.naturalHeight / image.height;
  }

  newImage.setAttribute('crossOrigin', 'anonymous');
  newImage.src = image.src;

  newImage.onload = () => {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.filter = `blur(${
      blurValue * cof
    }px) invert(${invertValue}%) sepia(${sepiaValue}%) saturate(${saturateValue}%) hue-rotate(${hueValue}deg)`;
    ctx.drawImage(newImage, 0, 0);

    const link = document.createElement('a');
    link.download = 'image/png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
    canvas.delete;
  };
}
saveBtn.addEventListener('click', savePicture);

// RESET
function reset() {
  filters.reset();
  inputs.forEach((input) => {
    if (input.nextElementSibling) {
      input.nextElementSibling.textContent = input.value;
    }
    image.style.setProperty(
      `--${input.name}`,
      `${input.defaultValue}${input.dataset.sizing || ''}`
    );
  });
}
resetBtn.addEventListener('click', reset);

// NEXT PICTURE
function getNextPicture() {
  const btnNext = document.querySelector('.btn-next');
  const pathToImage =
    'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  const images = [
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
    '08.jpg',
    '09.jpg',
    '10.jpg',
    '11.jpg',
    '12.jpg',
    '13.jpg',
    '14.jpg',
    '15.jpg',
    '16.jpg',
    '17.jpg',
    '18.jpg',
    '19.jpg',
    '20.jpg',
  ];
  let i = 0;

  function getTime() {
    let hours = new Date().getHours().toString();
    let minutes =
      new Date().getMinutes().toString().length < 2
        ? '0' + new Date().getMinutes().toString()
        : new Date().getMinutes().toString();

    const date = +(hours + minutes);

    let timeOfDay;
    if (date >= 600 && date <= 1159) {
      timeOfDay = 'morning';
    } else if (date >= 1800 && date <= 2359) {
      timeOfDay = 'evening';
    } else if (date >= 1200 && date <= 1759) {
      timeOfDay = 'day';
    } else if (date >= 0 && date <= 559) {
      timeOfDay = 'night';
    }
    return timeOfDay;
  }

  function getImagePath() {
    const index = i % images.length;
    const path = `${pathToImage}${getTime()}/${images[index]}`;
    viewBgImage(path);
    i++;
  }

  btnNext.addEventListener('click', () => {
    getImagePath();
    if (loadBtn) {
      loadBtn.value = '';
    }
  });
}
getNextPicture();

// LOAD PICTURE
function load() {
  const file = loadBtn.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    viewBgImage(reader.result);
  };

  reader.readAsDataURL(file);
}
loadBtn.addEventListener('input', load);

// FULLSCREEN
function fullScreen() {

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
fullScreenBtn.addEventListener('click', fullScreen);
