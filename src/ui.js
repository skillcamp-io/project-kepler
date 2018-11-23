import $ from 'cash-dom';

const TIME_BETWEEN_WAVES = 60 * 2 * 1000; // 60 seconds, times 2, times 1000 milliseconds


/**
 * Disables all buttons except the clicked one
 */
const disableOtherBtns = (el) => {
  const clickedUnitType = el.data('unit-type');

  const otherCards = $('.game-ui .menu li a').filter((index, element) => {
    const unitType = $(element).data('unit-type');
    return unitType !== clickedUnitType;
  });

  otherCards.removeClass('selected');
};

const buildUnit = (e) => {
  e.preventDefault();

  const clickedItem = $(e.target);
  clickedItem.toggleClass('active');

  disableOtherBtns(clickedItem);

  const unitType = clickedItem.data('unit-type');

  if (clickedItem.hasClass('active')) {
    $(document).trigger('build_unit', { type: unitType });
  } else {
    $(document).trigger('build_unit_canceled');
  }
};

$('.game-ui .menu li a').on('click', buildUnit);

document.onkeydown = (e) => {
  const evt = e || window.event;
  if (evt.keyCode === 27) {
    $('.unit-card').removeClass('selected');
    $(document).trigger('build_unit_canceled');
  }
};

/*
  Convert this to UI

  setUpWaveTimer() {
    this.text = this.add.text(32, 32);
    this.timedEvent = this.time.addEvent({
      delay: TIME_BETWEEN_WAVES,
      callback: this.timerCallback,
      callbackScope: this,
      loop: true,
    });

    this.gameModeText = this.add.text(this.cameras.main.width - 100, 32);
    this.gameModeText.setText('Building');
  }

  

  timerCallback() {
    console.log('TIMER!');
    this.currentlyBuilding = !this.currentlyBuilding;
  }

  
  handleTimerText() {
    const millis = TIME_BETWEEN_WAVES - (this.timedEvent.getElapsedSeconds().toFixed(0) * 1000);
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    const padding = seconds < 10 ? '0' : '';
    const str = `${minutes}:${padding}${seconds}`;

    this.text.setText(`Time to next wave: ${str}`);
  }

*/