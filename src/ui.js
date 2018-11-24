import $ from 'cash-dom';

/**
 * Disables all buttons except the clicked one
 */
const disableOtherBtns = (el) => {
  const clickedUnitType = el.data('unit-type');

  const otherCards = $('.unit-card').filter((index, element) => {
    const unitType = $(element).data('unit-type');
    return unitType !== clickedUnitType;
  });

  otherCards.removeClass('selected');
};

const buildUnit = (e) => {
  e.preventDefault();

  const clickedCard = $(e.target).parents('.unit-card');
  clickedCard.toggleClass('selected');

  disableOtherBtns(clickedCard);

  const unitType = clickedCard.data('unit-type');

  if (clickedCard.hasClass('selected')) {
    $(document).trigger('build_unit', { type: unitType });
  } else {
    $(document).trigger('build_unit_canceled');
  }
};

$('.unit-card').on('click', buildUnit);

document.onkeydown = (e) => {
  const evt = e || window.event;
  if (evt.keyCode === 27) {
    $('.unit-card').removeClass('selected');
    $(document).trigger('build_unit_canceled');
  }
};
