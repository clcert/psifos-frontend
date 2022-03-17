import $ from "jquery";
import { BigInt } from "../../../static/cabina/js/jscrypto/bigint";
import { sjcl } from "../../../static/cabina/js/jscrypto/sjcl";
import { ElGamal } from "../../../static/cabina/js/jscrypto/elgamal";
import { heliosc } from "../../../static/cabina/js/jscrypto/heliosc-trustee";
import ImageFooter from "../../../component/Footers/ImageFooter";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import Title from "../../../component/OthersComponents/Title";
import imageTrustees from "../../../static/svg/trustees1.svg"
import {
  PARAMS,
  CERTIFICATES,
  POINTS,
  SUM,
  SECRET_KEY,
} from "../../../static/cabina/js/jscrypto/heliosc-trustee";

function Keygenerator(props) {
  var COEFFICIENTS = [];
  var ACKS = [];
  var SENT, ACKS2;
  var TRUSTEE, CERTIFICATE;
  var ELGAMAL_PARAMS;

  class Steps {
    constructor() {
      this.actual_step = 0;
      this.execute = false;
      this.secret_key = null;
      //this.storage = window.localStorage;
      this.certificate = null;
      this.coefficients = null;
      this.points = null;
      this.acknowledgements = null;
      this.verification_key = null;
      this.interval = null;
    }

    init_process() {
      this.execute = false;
      this.total_process();
      $("#button-init").attr("disabled", true);
      this.interval = window.setInterval(() => {
        this.total_process();
      }, 1000);
    }

    total_process() {
      this.get_step();
      if (this.actual_step === 0 && !this.execute) {
        console.log("Step 0");
        this.execute = true;
        this.step_0();
      } else if (this.actual_step === 1 && !this.execute) {
        console.log("Step 1");
        this.execute = true;
        this.step_1();
      } else if (this.actual_step === 2 && !this.execute) {
        console.log("Step 2");
        this.execute = true;
        this.step_2();
      } else if (this.actual_step === 3 && !this.execute) {
        console.log("Step 3");
        this.execute = true;
        this.step_3();
      } else if (this.actual_step === 4) {
        window.clearInterval(this.interval);
        $("#process_step").text("Proceso completado!");
      }
    }

    step_0() {
      this.generate_keypair();
      this.download_sk_to_file("trustee_key_for{{election.name}}.txt");
      this.send_public_key();
      $("#process_step").text(
        "Proceso de generación de clave privada completado"
      );
    }

    step_1() {
      this.get_data_step("step1").then((data) => {
        if ("error" in data) {
          this.execute = false;
          $("#process_step").text(data["error"]);
          return;
        }

        $.getJSON("../../get-randomness", function (result) {
          sjcl.random.addEntropy(result.randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = "{{trustee.trustee_id}}";
            CERTIFICATES = JSON.parse(data["certificates"]);
          });

          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#derive");
          derivator.start();
        });
      });
    }

    step_2() {
      this.get_data_step("step2").then((data) => {
        if ("error" in data) {
          this.execute = false;
          $("#process_step").text(data["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        $.getJSON("../../get-randomness", function (result) {
          sjcl.random.addEntropy(result.randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = "{{trustee.trustee_id}}";
            CERTIFICATES = JSON.parse(data["certificates"]);
            COEFFICIENTS = JSON.parse(data["coefficents"]);
            POINTS = JSON.parse(data["points"]);
          });
          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#acknowledge");
          acknowledger.start();
        });
      });
    }

    step_3() {
      this.get_data_step("step3").then((data) => {
        if ("error" in data) {
          this.execute = false;
          $("#process_step").text(data["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        $.getJSON("../../get-randomness", function (result) {
          sjcl.random.addEntropy(result.randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = "{{trustee.trustee_id}}";
            CERTIFICATES = JSON.parse(data["certificates"]);
            COEFFICIENTS = JSON.parse(data["coefficents"]);
            POINTS = JSON.parse(data["points"]);
            SENT = JSON.parse(data["points_sent"]);
            ACKS2 = data["acks"];
          });
          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#check_acks");
          check_acks.start();
          heliosc.ui.share.start(prepare_upload);
        });
      });
    }

    async get_data_step(step) {
      let election_uuid = "{{election.uuid}}";
      let trustee_uuid = "{{trustee.uuid}}";
      let url =
        "/app/elections/" +
        String(election_uuid) +
        "/trustees/" +
        String(trustee_uuid) +
        "/" +
        step;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await resp.json();
      return jsonResponse;
    }

    async get_step() {
      let election_uuid = "{{election.uuid}}";
      let trustee_uuid = "{{trustee.uuid}}";
      let url =
        "/app/elections/" +
        String(election_uuid) +
        "/trustees/" +
        String(trustee_uuid) +
        "/" +
        "get-step";
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await resp.json();
      this.actual_step = jsonResponse["status"];
      return jsonResponse;
    }

    generate_keypair() {
      //$('#buttons').hide();
      try {
        TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
        this.setup_public_key_and_proof();
        return true;
      } catch (e) {
        alert(e);
        return false;
      }
    }

    setup_public_key_and_proof() {
      CERTIFICATE = TRUSTEE.generate_certificate();
      SECRET_KEY = TRUSTEE.get_secret_key();
      this.secret_key = SECRET_KEY;
      //this.storage.setItem('key', SECRET_KEY);
      this.certificate = $.toJSON(CERTIFICATE);
    }

    download_sk_to_file(filename) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + SECRET_KEY
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    async send_public_key() {
      $("#public_key_status").text("Enviando la clave publica...");

      let election_uuid = "{{election.uuid}}";
      let trustee_uuid = "{{trustee.uuid}}";
      let certificate = this.certificate;
      let url =
        "/app/elections/" +
        String(election_uuid) +
        "/trustees/" +
        String(trustee_uuid) +
        "/upload-pk";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_key_json: certificate,
        }),
      });

      const jsonResponse = await resp.json();
      $("#public_key_status").text("Clave publica enviada!!");
      this.actual_step = 1;
      this.execute = false;
      set_step_init();
    }
  }

  async function send_step(step, data) {
    $("#public_key_status").text("Enviando la clave publica...");
    let election_uuid = "{{election.uuid}}";
    let trustee_uuid = "{{trustee.uuid}}";
    let url =
      "/app/elections/" +
      String(election_uuid) +
      "/trustees/" +
      String(trustee_uuid) +
      "/step" +
      step;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    process.actual_step = process.actual_step + 1;
    process.execute = false;
    set_step_init();
    $("#process_step").text("Etapa " + step + " completada");
  }

  function prepare_upload() {
    var pk = {
      g: PARAMS.g.toString(),
      p: PARAMS.p.toString(),
      q: PARAMS.q.toString(),
      y: PARAMS.g.modPow(SUM, PARAMS.p).toString(),
    };
    process.verification_key = $.toJSON(pk);
    const verification_key = process.verification_key;
    send_step(
      3,
      JSON.stringify({
        verification_key: verification_key,
      })
    );
  }

  var derivator = {
    coeff: function (i) {
      if (i <= PARAMS.t) {
        setTimeout(function () {
          COEFFICIENTS[i] = TRUSTEE.generate_coefficient(i);
          setTimeout(function () {
            derivator.coeff(i + 1);
          }, 500);
        }, 500);
      } else {
        this.point(0);
      }
    },

    point: function (i) {
      if (i < PARAMS.l) {
        var id = i + 1;
        setTimeout(function () {
          derivator.pk.y = new BigInt(CERTIFICATES[i].encryption_key);
          POINTS[i] = TRUSTEE.generate_point(id, derivator.pk);
          setTimeout(function () {
            derivator.point(i + 1);
          }, 500);
        }, 500);
      } else {
        process.coefficients = $.toJSON(COEFFICIENTS);
        process.points = $.toJSON(POINTS);
        const coefficients = process.coefficients;
        const points = process.points;
        send_step(
          1,
          JSON.stringify({
            coefficients: coefficients,
            points: points,
          })
        );
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.coeff(0);
    },
  };

  var acknowledger = {
    trustee: function (i) {
      if (i < PARAMS.l) {
        var id = i + 1;
        setTimeout(function () {
          var pk = acknowledger.pk;
          pk.y = new BigInt(CERTIFICATES[i].signature_key);
          var ack = TRUSTEE.check_point(id, pk, POINTS[i], COEFFICIENTS[i]);
          if (ack) {
            ACKS[i] = ack;
            setTimeout(function () {
              acknowledger.trustee(i + 1);
            }, 500);
          } else {
            console.log("Point from trustee #" + id + " failed validation!");
          }
        }, 500);
      } else {
        process.acknowledgements = $.toJSON(ACKS);
        const ack = process.acknowledgements;
        send_step(
          2,
          JSON.stringify({
            acknowledgements: ack,
          })
        );
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.trustee(0);
    },
  };

  var check_acks = {
    trustee: function (i) {
      var log = this.log;
      if (i < PARAMS.l) {
        var id = i + 1;
        console.log("Checking acknowledgement from trustee #" + id + "...");
        setTimeout(function () {
          var pk = check_acks.pk;
          pk.y = new BigInt(CERTIFICATES[i].signature_key);
          if (TRUSTEE.check_ack(id, pk, SENT[i], ACKS2[i])) {
            setTimeout(function () {
              check_acks.trustee(i + 1);
            }, 500);
          } else {
            console.log("Trustee #" + id + " did not acknowledge!");
          }
        }, 500);
      } else {
        console.log("SUCCESS!");
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.trustee(0);
    },
  };

  // start collecting some local randomness
  sjcl.random.startCollectors();
  var process = new Steps();

  function set_step_init() {
    process.get_step().then((data) => {
      const step = data["status"];
      if (step > 0) {
        if (step === 4) {
          $("#button-init").attr("disabled", true);
        }
        $("#button-init").text("Continuar proceso");
        for (let i = 0; i < step; i++) {
          $("#step_" + i).attr("class", "fa-solid fa-circle-check");
        }
      }
    });
  }

  set_step_init();

  // get some more server-side randomness for keygen
  $.getJSON("../../get-randomness", function (result) {
    sjcl.random.addEntropy(result.randomness);
    BigInt.setup(function () {
      ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject("{{eg_params_json|safe}}");
      ELGAMAL_PARAMS.trustee_id = "{{trustee.trustee_id}}";
      TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
    });
  });

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Custodio de Claves" nameElection="Pagina privada de Vocal" />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <div class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="pb-2 title has-text-white">
                  Generación claves{" "}
                  <i id="step_0" class="fa-solid fa-circle-xmark"></i>
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="pb-2 title has-text-white">
                  Etapa 1 <i id="step_1" class="fa-solid fa-circle-xmark"></i>
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="pb-2 title has-text-white">
                  Etapa 2 <i id="step_2" class="fa-solid fa-circle-xmark"></i>
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="pb-2 title has-text-white">
                  Etapa 3 <i id="step_3" class="fa-solid fa-circle-xmark"></i>
                </p>
              </div>
            </div>
          </div>
          <div id="process_step" class="has-text-white"></div>
          <br />
          <button
            id="button-init"
            class="button is-link"
            onclick="process.init_process()"
          >
            Iniciar Proceso
          </button>
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
    </div>
  );
}

export default Keygenerator;
