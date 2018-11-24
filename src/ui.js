import $ from 'cash-dom';
import Tock from 'tocktimer';

const TIME_BETWEEN_WAVES = 60 * 1 * 1000; // 60 seconds, times 2, times 1000 milliseconds
let buildingMode = true;
let buildingModeText = 'Building';
let timer = null;

const toggleGameMode = () => {
  buildingMode = !buildingMode;

  buildingModeText = buildingMode ? 'Building' : 'Fighting';

  // TODO: Maybe not loop waves? More logic?
  timer.start(TIME_BETWEEN_WAVES);
};

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

const cancelUnitBuilding = () => {
  // Remove active class and blur
  $('.build-ui .menu li a.active').removeClass();
  document.activeElement.blur();
  $(document).trigger('build_unit_canceled');
};

timer = new Tock({
  countdown: true,
  interval: 10,
  callback: () => {
    const currentTime = timer.msToTime(timer.lap()).substring(0, 5);
    $('.timer').text(`${buildingModeText}: ${currentTime}`);
  },
  complete: () => {
    $(document).trigger('wave_timer_finished');
    toggleGameMode();
  },
});

// Start our timer, cound down 2 mins
// TODO: Start at 2 min right away, should something trigger the initial countdown
timer.start(TIME_BETWEEN_WAVES);

/**
 * Handle clicking menu items
 */
$('.build-ui .menu li a').on('click', buildUnit);

/**
 * Reset building when menu is opened and closed
 */
$('.build-ui .accordion-header').on('click', () => {
  cancelUnitBuilding();
});

document.onkeydown = (e) => {
  const evt = e || window.event;
  if (evt.keyCode === 27) {
    cancelUnitBuilding();
  }
};

/**
 * Start the wave countdown when we receive the event
 */
$(document).on('start_wave_countdown', () => {
  timer.start(TIME_BETWEEN_WAVES);
});
