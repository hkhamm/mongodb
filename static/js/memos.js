var memos = {};


// jQuery HTML elements

memos.addButton = $('#add-button');
memos.removeButton = $('button[name="remove-button"]');
memos.dateField = $('#date');
memos.textField = $('#text');
memos.memosDiv = $('#memos');
memos.copyMemo = $('.copy-memo');
memos.noMemosMessage = $('#no-memos-message');
memos.memoLabels = $('.memo-labels');
memos.memoCount = 0;


/**
 * Initializes memoCount and hides various page elements.
 */
(function() {
  memos.memoCount = $("#memos > #memo").length - 1;

  if (memos.memoCount > 0) {
    memos.noMemosMessage.hide();
  }

  if (memos.memoCount == 0) {
    memos.memoLabels.hide();
  }

  memos.copyMemo.hide();
})();


// Listeners

/**
 * Listens for clicks on the add memo button.
 */
memos.addButton.click(function() {
  var date = memos.dateField.val();
  var text = memos.textField.val();
  var oldMemo = $('#memo:first');
  var newMemo = $(oldMemo.clone());

  // TODO validate date before insert

  memos.insertMemo(date, newMemo);

  if (memos.memoCount == 0) {
    memos.noMemosMessage.hide();
    memos.memoLabels.show();
  }

  if ($("#memos > #memo").length > 1 || memos.copyMemo.hidden()) {
    newMemo.show();
  }

  memos.memoCount++;

  memos.dateField.val('');
  memos.textField.val('');

  newMemo.find('div').text('');
  newMemo.find('#memo_date').text(date);
  newMemo.find('#memo_text').text(text);

  newMemo.find('#remove-button').click(function() {
    memos.removeMemo($(this));
  });

  $.getJSON($SCRIPT_ROOT + '/_add_memo', {
    date: date,
    text: text
  }, function(data) {
    //console.log(data.message);
  });
});

/**
 * Listens for clicks on the remove memo button.
 */
memos.removeButton.click(function() {
  var date = $(this).parent().find('#memo_date').text();
  var text = $(this).parent().find('#memo_text').text();
  var object_id = $(this).parent().data('object_id');

  memos.removeMemo($(this));

  $.getJSON($SCRIPT_ROOT + '/_remove_memo', {
    object_id: object_id
  }, function(data) {
    //console.log(data.message);
  });
});


// Other functions

/**
 * Removes a memo.
 * @param button is the pressed remove button
 */
memos.removeMemo = function(button) {
  memos.memoCount--;

  if (memos.memoCount > 0) {
    button.parent().remove();
  } else {
    memos.noMemosMessage.show();
    memos.memoLabels.hide();
    button.parent().find('#memo_date').text('');
    button.parent().find('#memo_text').text('');
    button.parent().hide();
  }
};


/**
 * Inserts a memo in ascending date order.
 * @param date is the memo's dat
 * @param newMemo is the memo to insert.
 */
memos.insertMemo = function(date, newMemo) {
  var newDate = moment(date, "YYYY/MM/DD");
  var isInserted = false;

  $("#memos > #memo").each(function() {
    var thisDate = moment($(this).find('#memo_date').text(), "YYYY/MM/DD");

    if (thisDate > newDate && !isInserted) {
      $(this).before(newMemo);
      isInserted = true;
    }
  });
};