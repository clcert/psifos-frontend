import $ from "jquery";
import { HELIOS, UTILS, BALLOT } from "./jscrypto/helios";
import { USE_SJCL } from "./jscrypto/bigint";
import _ from "lodash";
import { BigInt } from "./jscrypto/bigint";
import { sjcl } from "./jscrypto/sjcl";
import { b64_sha256 } from "./jscrypto/sha2";

// utils
let BOOTH = {};

BOOTH.vote_url = function () {
  if (
    window.confirm(
      "¿Estás seguro de reiniciar el proceso de votación y perder todo tu avance?"
    )
  ) {
    BOOTH.started_p = false;
    window.location =
      "vote.html?election_url=/vota/elections/" + this.election.uuid;
  }
};

BOOTH.setup_templates = function () {
  if (BOOTH.templates_setup_p) return;

  var cache_bust = "?cb=" + new Date().getTime();

  $("#header").setTemplateURL("templates/header.html" + cache_bust);
  $("#election_div").setTemplateURL("templates/instructions.html" + cache_bust);
  $("#progress_div").setTemplateURL("templates/progress.html" + cache_bust);
  $("#question_div").setTemplateURL("templates/question.html" + cache_bust);
  $("#seal_div").setTemplateURL("templates/review.html" + cache_bust);
  $("#audit_div").setTemplateURL("templates/audit.html" + cache_bust);
  $("#footer").setTemplateURL("templates/footer.html" + cache_bust);
  $("#bottom").setTemplateURL("templates/bottom.html" + cache_bust);

  BOOTH.templates_setup_p = true;
};

// set up the message when navigating away
BOOTH.started_p = false;

window.onbeforeunload = function (evt) {
  if (!BOOTH.started_p) return;

  if (typeof evt == "undefined") {
    evt = window.event;
  }

  var message =
    "If you leave this page with an in-progress ballot, your ballot will be lost.";

  if (evt) {
    evt.returnValue = message;
  }

  return message;
};

BOOTH.exit = function () {
  if (
    window.confirm(
      "¿Estás seguro de salir de la cabina de votación y perder todo tu avance?"
    )
  ) {
    BOOTH.started_p = false;
    // window.location = BOOTH.election.cast_url;
    window.location = "https://participa.uchile.cl/";
  }
};

BOOTH.setup_ballot = function (election) {
  BOOTH.ballot = {};

  // dirty markers for encryption (mostly for async)
  BOOTH.dirty = [];

  // each question starts out with an empty array answer
  // and a dirty bit to make sure we encrypt
  BOOTH.ballot.answers = [];
  $(BOOTH.election.questions).each(function (i, x) {
    BOOTH.ballot.answers[i] = [];
    BOOTH.dirty[i] = true;
  });
};

// all ciphertexts to null
BOOTH.reset_ciphertexts = function () {
  _(BOOTH.encrypted_answers).each(function (enc_answer, ea_num) {
    BOOTH.launch_async_encryption_answer(ea_num);
  });
};

BOOTH.log = function (msg) {
  if (typeof console != undefined) console.log(msg);
};

BOOTH.setup_workers = function (election_raw_json) {
  // async?
  if (!BOOTH.synchronous) {
    // prepare spots for encrypted answers
    // and one worker per question
    BOOTH.encrypted_answers = [];
    BOOTH.answer_timestamps = [];
    BOOTH.worker = new Worker(
      new URL("./boothworker-single.worker.js", import.meta.url)
    );
    BOOTH.worker.postMessage({
      type: "setup",
      election: election_raw_json,
    });

    BOOTH.worker.onmessage = function (event) {
      // logging
      if (event.data.type == "log") return BOOTH.log(event.data.msg);

      // result of encryption
      if (event.data.type == "result") {
        // this check ensures that race conditions
        // don't screw up votes.
        if (event.data.id == BOOTH.answer_timestamps[event.data.q_num]) {
          BOOTH.encrypted_answers[event.data.q_num] =
            HELIOS.EncryptedAnswer.fromJSONObject(
              event.data.encrypted_answer,
              BOOTH.election
            );
          BOOTH.log("got encrypted answer " + event.data.q_num);
        } else {
          BOOTH.log("no way jose");
        }
      }
    };

    $(BOOTH.election.questions).each(function (q_num, q) {
      BOOTH.encrypted_answers[q_num] = null;
    });
  }
};

function escape_html(content) {
  return $("<div/>").text(content).html();
}

BOOTH.setup_election = function (raw_json, election_metadata) {
  // IMPORTANT: we use the raw JSON for safer hash computation
  // so that we are using the JSON serialization of the SERVER
  // to compute the hash, not the JSON serialization in JavaScript.
  // the main reason for this is unicode representation: the Python approach
  // appears to be safer.
  BOOTH.election = HELIOS.Election.fromJSONString(raw_json);

  // FIXME: we shouldn't need to set both, but right now we are doing so
  // because different code uses each one. Bah. Need fixing.
  BOOTH.election.hash = b64_sha256(raw_json);
  BOOTH.election.election_hash = BOOTH.election.hash;

  // async?
  BOOTH.setup_workers(raw_json);

  document.title += " - " + BOOTH.election.name;

  // escape election fields
  $(["description", "name"]).each(function (i, field) {
    BOOTH.election[field] = escape_html(BOOTH.election[field]);
  });

  // TODO: escape question and answers

  // whether the election wants candidate order randomization or not
  // we set up an ordering array so that the rest of the code is
  // less error-prone.
  BOOTH.election.question_answer_orderings = [];
  $(BOOTH.election.questions).each(function (i, question) {
    var ordering = new Array(question.answers.length);

    // initialize array so it is the identity permutation
    $(ordering).each(function (j, answer) {
      ordering[j] = j;
    });

    // if we want reordering, then we shuffle the array
    if (election_metadata && election_metadata.randomize_answer_order) {
      shuffleArray(ordering);
    }

    BOOTH.election.question_answer_orderings[i] = ordering;
  });

  // $("#content").addClass("parallax-01");
  // $("#header").processTemplate({
  //   election: BOOTH.election,
  //   election_metadata: BOOTH.election_metadata,
  // });
  // $("#progress_div").processTemplate({
  //   election: BOOTH.election,
  //   election_metadata: BOOTH.election_metadata,
  // });
  // $("#footer").processTemplate({
  //   election: BOOTH.election,
  //   election_metadata: BOOTH.election_metadata,
  // });
  // $("#bottom").processTemplate({
  //   election: BOOTH.election,
  //   election_metadata: BOOTH.election_metadata,
  // });
  BOOTH.setup_ballot();
};

BOOTH.show = function (el) {
  $(".panel").hide();
  el.show();
  return el;
};

BOOTH.show_election = function () {
  BOOTH.show($("#election_div")).processTemplate({ election: BOOTH.election });
};

BOOTH.launch_async_encryption_answer = function (question_num) {
  BOOTH.answer_timestamps[question_num] = new Date().getTime();
  BOOTH.encrypted_answers[question_num] = null;
  BOOTH.dirty[question_num] = false;
  BOOTH.worker.postMessage({
    type: "encrypt",
    q_num: question_num,
    answer: BOOTH.ballot.answers[question_num],
    id: BOOTH.answer_timestamps[question_num],
  });
};

// check if the current question is ok
BOOTH.validate_question = function (question_num) {
  // check if enough answers are checked
  if (
    BOOTH.ballot.answers[question_num].length <
    BOOTH.election.questions[question_num].min
  ) {
    alert(
      "Debes seleccionar a lo menos " +
        BOOTH.election.questions[question_num].min +
        " respuesta(s)."
    );
    return false;
  }

  // if we need to launch the worker, let's do it
  if (!BOOTH.synchronous) {
    // we need a unique ID for this to ensure that old results
    // don't mess things up. Using timestamp.
    // check if dirty
    if (BOOTH.dirty[question_num]) {
      BOOTH.launch_async_encryption_answer(question_num);
    }
  }
  return true;
};

BOOTH.validate_and_confirm = function (question_num) {
  if (BOOTH.validate_question(question_num)) {
    BOOTH.seal_ballot();
    BOOTH.switch_background_image("03");
    $(window).scrollTop($("#progress_div").position().top);
  }
};

BOOTH.next = function (question_num) {
  if (BOOTH.validate_question(question_num)) {
    BOOTH.show_question(question_num + 1, false);
  }
  if ($(window).scrollTop() > $("#question_div").position().top) {
    $(window).scrollTop($("#question_div").position().top);
  }
};

BOOTH.previous = function (question_num) {
  BOOTH.show_question(question_num - 1, false);
  if ($(window).scrollTop() > $("#question_div").position().top) {
    $(window).scrollTop($("#question_div").position().top);
  }
  // if (BOOTH.validate_question(question_num)) {
  //     BOOTH.show_question(question_num - 1);
  // }
};

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

BOOTH.show_question = function (question_num, editing) {
  BOOTH.started_p = true;

  // the first time we hit the last question, we enable the review all button
  if (question_num == BOOTH.election.questions.length - 1)
    BOOTH.all_questions_seen = true;

  BOOTH.show_progress("1");
  BOOTH.show($("#question_div")).processTemplate({
    question_num: question_num,
    last_question_num: BOOTH.election.questions.length - 1,
    question: BOOTH.election.questions[question_num],
    show_reviewall: BOOTH.all_questions_seen,
    answer_ordering: BOOTH.election.question_answer_orderings[question_num],
    editing: editing,
  });

  // fake clicking through the answers, to trigger the disabling if need be
  // first we remove the answers array
  var answer_array = BOOTH.ballot.answers[question_num];
  BOOTH.ballot.answers[question_num] = [];

  // we should not set the dirty bit here, so we save it away
  var old_dirty = BOOTH.dirty[question_num];
  $(answer_array).each(function (i, ans) {
    BOOTH.click_checkbox_script(question_num, ans, true);
  });
  BOOTH.dirty[question_num] = old_dirty;
};

BOOTH.click_checkbox_script = function (question_num, answer_num) {
  document.forms["answer_form"][
    "answer_" + question_num + "_" + answer_num
  ].click();
};

BOOTH.click_radiobox = function (question_num, answer_num, checked_p) {
  // keep track of dirty answers that need encrypting
  BOOTH.dirty[question_num] = true;

  if ($(BOOTH.ballot.answers[question_num]).index(answer_num) == -1)
    var answer_unselected = BOOTH.ballot.answers[question_num].pop();
  console.log("a: " + answer_unselected);
  $("#answer_wrapper_" + question_num + "_" + answer_unselected).removeClass(
    "answer-selected"
  );
  BOOTH.ballot.answers[question_num].push(answer_num);
  $("#answer_wrapper_" + question_num + "_" + answer_num).addClass(
    "answer-selected"
  );
};

BOOTH.click_checkbox = function (question_num, answer_num, checked_p) {
  // keep track of dirty answers that need encrypting
  BOOTH.dirty[question_num] = true;

  let answer_text = BOOTH.election.questions[question_num].answers[answer_num];
  let is_null_or_blank =
    answer_text === "Voto Nulo" || answer_text === "Voto Blanco";

  if (checked_p) {
    // multiple click events shouldn't screw this up
    if ($(BOOTH.ballot.answers[question_num]).index(answer_num) == -1)
      BOOTH.ballot.answers[question_num].push(answer_num);

    $("#answer_wrapper_" + question_num + "_" + answer_num).addClass(
      "answer-selected"
    );
  } else {
    BOOTH.ballot.answers[question_num] = UTILS.array_remove_value(
      BOOTH.ballot.answers[question_num],
      answer_num
    );
    $("#answer_wrapper_" + question_num + "_" + answer_num).removeClass(
      "answer-selected"
    );
  }

  if (
    (BOOTH.election.questions[question_num].max != null &&
      BOOTH.ballot.answers[question_num].length >=
        BOOTH.election.questions[question_num].max) ||
    (is_null_or_blank && checked_p)
  ) {
    // disable the other checkboxes
    $(".ballot_answer").each(function (i, checkbox) {
      if (!checkbox.checked) checkbox.disabled = true;
    });

    if (
      is_null_or_blank &&
      checked_p &&
      BOOTH.ballot.answers[question_num].length > 1
    ) {
      $(".ballot_answer").each(function (i, checkbox) {
        if (checkbox.checked && i !== answer_num) {
          BOOTH.ballot.answers[question_num] = UTILS.array_remove_value(
            BOOTH.ballot.answers[question_num],
            i
          );
          $("#answer_wrapper_" + question_num + "_" + i).removeClass(
            "answer-selected"
          );
          checkbox.disabled = true;
          checkbox.checked = false;
        }
      });
    }

    // do the warning only if the question allows more than one option, otherwise it's confusing
    if (BOOTH.election.questions[question_num].max > 1) {
      $("#warning_box").html(
        "Maximum number of options selected.<br />To change your selection, please de-select a current selection first."
      );
    }
  } else {
    // enable the other checkboxes
    $(".ballot_answer").each(function (i, checkbox) {
      checkbox.disabled = false;
    });
    $("#warning_box").html("");
  }
};

BOOTH.show_processing_before = function (str_to_execute) {
  $("#processing_div").html("<h3 align='center'>Processing...</h3>");
  BOOTH.show($("#processing_div"));

  // add a timeout so browsers like Safari actually display the processing message
  setTimeout(str_to_execute, 250);
};

BOOTH.show_encryption_message_before = function (func_to_execute) {
  BOOTH.show_progress("2");
  BOOTH.show($("#encrypting_div"));

  func_to_execute();
};

BOOTH.load_and_setup_election = function (election_url) {
  // the hash will be computed within the setup function call now
  $.get(election_url, function (raw_json) {
    // let's also get the metadata
    $.getJSON(election_url + "/meta", {}, function (election_metadata) {
      BOOTH.election_metadata = election_metadata;
      BOOTH.setup_election(raw_json, election_metadata);
      BOOTH.show_election();
      BOOTH.election_url = election_url;
    });
  });

  if (USE_SJCL) {
    // get more randomness from server
    $.get(election_url + "/get-randomness", {}, function (raw_json) {
      sjcl.random.addEntropy(JSON.parse(raw_json).randomness);
    });
  }
};

BOOTH.hide_progress = function () {
  $("#progress_div").hide();
};

BOOTH.show_progress = function (step_num) {
  $("#progress_div").show();
  $("#progress-" + step_num).attr("src", "svg/menu" + step_num + "-2.svg");

  $(["1", "2", "3", "4"]).each(function (n, step) {
    if (step == step_num)
      $("#progress-" + step).attr("src", "svg/menu" + step + "-2.svg");
    else $("#progress-" + step).attr("src", "svg/menu" + step + "-1.svg");
  });
};

BOOTH.so_lets_go = function () {
  BOOTH.hide_progress();

  //BOOTH.setup_templates();

  // election URL
  //var election_url = $.query.get("election_url");
  let election_url = null;
  BOOTH.load_and_setup_election(election_url);
};

BOOTH.nojava = function () {
  // in the case of Chrome, we get here when Java
  // is disabled, instead of detecting the problem earlier.
  // because navigator.javaEnabled() still returns true.
  // $('#election_div').hide();
  // $('#error_div').show();
  USE_SJCL = true;
  sjcl.random.startCollectors();
  BigInt.setup(BOOTH.so_lets_go);
};

BOOTH.ready_p = false;

// $(document).ready(function () {
//   if (USE_SJCL) {
//     sjcl.random.startCollectors();
//   }

//   // we're asynchronous if we have SJCL and Worker
//   BOOTH.synchronous = !(USE_SJCL && window.Worker);

//   // we do in the browser only if it's asynchronous
//   BigInt.in_browser = !BOOTH.synchronous;

//   // set up dummy bigint for fast parsing and serialization
//   if (!BigInt.in_browser) BigInt = BigIntDummy;

//   BigInt.setup(BOOTH.so_lets_go, BOOTH.nojava);
// });

BOOTH.check_encryption_status = function () {
  var progress = BOOTH.progress.progress();
  if (progress == "" || progress == null) progress = "0";

  $("#percent_done").html(progress);
};

BOOTH._after_ballot_encryption = function () {
  // if already serialized, use that, otherwise serialize
  BOOTH.encrypted_vote_json =
    BOOTH.encrypted_ballot_serialized ||
    JSON.stringify(BOOTH.encrypted_ballot.toJSONObject());

  var do_hash = function () {
    BOOTH.encrypted_ballot_hash = b64_sha256(BOOTH.encrypted_vote_json); // BOOTH.encrypted_ballot.get_hash();
    //window.setTimeout(show_cast, 0);
  };

  // var show_cast = function () {
  //   $("#seal_div").processTemplate({
  //     cast_url: BOOTH.election.cast_url,
  //     encrypted_vote_json: BOOTH.encrypted_vote_json,
  //     encrypted_vote_hash: BOOTH.encrypted_ballot_hash,
  //     election_uuid: BOOTH.election.uuid,
  //     election_hash: BOOTH.election_hash,
  //     election: BOOTH.election,
  //     election_metadata: BOOTH.election_metadata,
  //     questions: BOOTH.election.questions,
  //     choices: BALLOT.pretty_choices(BOOTH.election, BOOTH.ballot),
  //   });
  //   BOOTH.show($("#seal_div"));
  //   BOOTH.encrypted_vote_json = null;
  // };

  console.log(BOOTH.encrypted_vote_json);

  window.setTimeout(do_hash, 0);
};

BOOTH.copyToClipboard = function (element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).html().trim()).select();
  document.execCommand("copy");
  $temp.remove();
  $("#vote-fingerprint-anchor").attr("data-tooltip", "¡Copiado!");
  document
    .getElementById("vote-fingerprint-anchor")
    .addEventListener("mouseleave", function (event) {
      $("#vote-fingerprint-anchor").attr("data-tooltip", "Copiar");
    });
};

BOOTH.total_cycles_waited = 0;

// wait for all workers to be done
BOOTH.wait_for_ciphertexts = function () {
  BOOTH.total_cycles_waited += 1;

  var answers_done = _.reject(BOOTH.encrypted_answers, _.isNull);
  var percentage_done = Math.round(
    (100 * answers_done.length) / BOOTH.encrypted_answers.length
  );
  console.log(percentage_done);

  if (BOOTH.total_cycles_waited > 250) {
    alert(
      "there appears to be a problem with the encryption process.\nPlease email help@heliosvoting.org and indicate that your encryption process froze at " +
        percentage_done +
        "%"
    );
    return;
  }

  if (percentage_done < 100) {
    setTimeout(BOOTH.wait_for_ciphertexts, 500);
    $("#percent_done").html(percentage_done + "");
    return;
  }

  BOOTH.encrypted_ballot = HELIOS.EncryptedVote.fromEncryptedAnswers(
    BOOTH.election,
    BOOTH.encrypted_answers
  );

  BOOTH._after_ballot_encryption();
};

BOOTH.seal_ballot_raw = function () {
  if (BOOTH.synchronous) {
    BOOTH.progress = new UTILS.PROGRESS();
    var progress_interval = setInterval("BOOTH.check_encryption_status()", 500);
    BOOTH.encrypted_ballot = new HELIOS.EncryptedVote(
      BOOTH.election,
      BOOTH.ballot.answers,
      BOOTH.progress
    );
    clearInterval(progress_interval);
    BOOTH._after_ballot_encryption();
  } else {
    BOOTH.total_cycles_waited = 0;
    BOOTH.wait_for_ciphertexts();
  }
};

BOOTH.request_ballot_encryption = function () {
  $.post(
    BOOTH.election_url + "/encrypt-ballot",
    { answers_json: $.toJSON(BOOTH.ballot.answers) },
    function (result) {
      //BOOTH.encrypted_ballot = HELIOS.EncryptedVote.fromJSONObject($.secureEvalJSON(result), BOOTH.election);
      // rather than deserialize and reserialize, which is inherently slow on browsers
      // that already need to do network requests, just remove the plaintexts

      BOOTH.encrypted_ballot_with_plaintexts_serialized = result;
      var ballot_json_obj = $.secureEvalJSON(
        BOOTH.encrypted_ballot_with_plaintexts_serialized
      );
      var answers = ballot_json_obj.answers;
      for (var i = 0; i < answers.length; i++) {
        delete answers[i]["answer"];
        delete answers[i]["randomness"];
      }

      BOOTH.encrypted_ballot_serialized = JSON.stringify(ballot_json_obj);

      window.setTimeout(BOOTH._after_ballot_encryption, 0);
    }
  );
};

BOOTH.seal_ballot = function () {
  BOOTH.show_progress("2");

  // if we don't have the ability to do crypto in the browser,
  // we use the server
  if (!BigInt.in_browser) {
    BOOTH.show_encryption_message_before(BOOTH.request_ballot_encryption, true);
  } else {
    BOOTH.show_encryption_message_before(BOOTH.seal_ballot_raw, true);
    $("#percent_done_container").show();
  }
};

BOOTH.audit_ballot = function () {
  BOOTH.audit_trail =
    BOOTH.encrypted_ballot_with_plaintexts_serialized ||
    $.toJSON(BOOTH.encrypted_ballot.get_audit_trail());

  BOOTH.show($("#audit_div")).processTemplate({
    audit_trail: BOOTH.audit_trail,
    election_url: BOOTH.election_url,
  });
};

BOOTH.post_audited_ballot = function () {
  $.post(
    BOOTH.election_url + "/post-audited-ballot",
    { audited_ballot: BOOTH.audit_trail },
    function (result) {
      alert(
        "El voto auditado fue publicado.\nRecuerda que este voto no será contabilizado.\nHaz click en VOLVER A VOTAR para completar el proceso de votación."
      );
    }
  );
};

BOOTH.cast_ballot = function () {
  // show progress spinner
  $("#loading_div").show();
  $("#proceed_button").attr("disabled", "disabled");

  // at this point, we delete the plaintexts by resetting the ballot
  BOOTH.setup_ballot(BOOTH.election);

  // clear the plaintext from the encrypted
  if (BOOTH.encrypted_ballot) BOOTH.encrypted_ballot.clearPlaintexts();

  BOOTH.encrypted_ballot_serialized = null;
  BOOTH.encrypted_ballot_with_plaintexts_serialized = null;

  // remove audit trail
  BOOTH.audit_trail = null;

  // we're ready to leave the site
  BOOTH.started_p = false;

  // submit the form
  $("#send_ballot_form").submit();
};

BOOTH.show_receipt = function () {
  UTILS.open_window_with_content(
    "Your smart ballot tracker for " +
      BOOTH.election.name +
      ": " +
      BOOTH.encrypted_ballot_hash
  );
};

BOOTH.do_done = function () {
  BOOTH.started_p = false;
};

BOOTH.switch_background_image = function (num) {
  $("#content")
    .removeClass("parallax-01")
    .removeClass("parallax-02")
    .removeClass("parallax-03")
    .removeClass("parallax-04")
    .removeClass("parallax-05")
    .addClass("parallax-" + num);
};

export { BOOTH };
