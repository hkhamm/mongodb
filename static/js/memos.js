/**
 * Simple web-based list of dated memos kept in a MongoDB database accessed
 * with Flask.
 * @author H. Keith Hamm
 * @date: Fall 2015
 */

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
memos.alerts = $('#alerts');
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

  if (!memos.checkDate(date)) {
    return;
  }

  $.getJSON($SCRIPT_ROOT + '/_add_memo', {
    date: date,
    text: text
  }, function(data) {
    console.log(data.message);

    if (data.result == true) {
      memos.addMemo(date, text);
    }
  });
});


/**
 * Listens for clicks on the remove memo button for memos that are present
 * when the page is loaded.
 */
memos.removeButton.click(function() {
  var object_id = $(this).parent().data('object_id');
  var memo = $(this);

  $.getJSON($SCRIPT_ROOT + '/_remove_memo', {
    object_id: object_id
  }, function(data) {
    console.log(data.message);

    if (data.result == true) {
      memos.removeMemo(memo);
    }
  });
});


// Other functions

/**
 * Adds a memo to the memos div.
 *
 * @param date is the memo's date.
 * @param text is the memo's text.
 */
memos.addMemo = function(date, text) {
  var oldMemo = $('#memo:first');
  var newMemo = $(oldMemo.clone());

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
};


/**
 * Removes a memo from the memos div.
 *
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
 *
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


/**
 * Checks if a date is in the valid form: YYYY/MM/DD.
 *
 * @param date
 * @returns {boolean}
 */
memos.checkDate = function(date) {
  var is_valid = true;
  var regex = /[1-9][0-9][0-9][0-9]\/[0-1][0-2]\/[0-3][0-9]/;

  if (!regex.test(date) &&
      !memos.alerts.find('#dateAlert' + memos.memoCount).length) {
    memos.alert('The date you just entered is not valid. It must be an real' +
      ' date and be in the correct form: YYYY/MM/DD',
      'dateAlert' + memos.memoCount);
    is_valid = false;
  }

  return is_valid;
};


/**
 * Creates a Bootstrap alert.
 *
 * @param message The alert message.
 * @param alert_type The alert type.
 */
memos.alert = function(message, alert_type) {
  var alertMsg = '<div class="alert alert-danger alert-dismissible" \
  role="alert" id="' + alert_type + '"><button type="button" class="close" \
  data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;\
  </span></button><strong>Warning!</strong> ' + message + '</div>';

  memos.alerts.append(alertMsg);
};