

function Question(props){


    return(
        <form onsubmit="return false;" class="prettyform" id="answer_form">
    <input type="hidden" name="question_num" value="{$T.question_num}" />

    <section class="section pb-0" id="question-section">
        <div class="container has-text-centered is-max-desktop">
            <p class="subtitle is-italic mb-0">Pregunta</p>
            <p class="title is-4 has-text-black pt-6"></p>
            <p class="subtitle is-italic">
                (seleccionar
                {/* {#if $T.question.min >= 0}
                {#if $T.question.max}
                {#if $T.question.min == $T.question.max}
                {#if $T.question.min == 1}
                solo {$T.question.min} opción)
                {#else}
                solo {$T.question.min} opciones)
                {#/if}
                {#else}
                {$T.question.min} a {$T.question.max} opciones)
                {#/if}
                {#else}
                {#if $T.question.min > 0}
                al menos {$T.question.min})
                {#else}
                cuantos quieras)
                {#/if}
                {#/if}
                {#/if} */}
            </p>

            <div class="box has-text-left question-box has-text-white is-flex is-justify-content-center">
                <div class="control control-box">
                    <div id="answer_label_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}">

                        <label id="answer_wrapper_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" class="radio question-answer p-2">
                            <input type="radio" id="answer_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" name="answer_{$T.question_num}" value="answer_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" onclick="BOOTH.click_radiobox({$T.question_num}, {$T.answer_ordering[$T.answer$index]}, this.checked);"/>
                            <label id="answer_wrapper_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" class="checkbox question-answer p-2">
                            <input type="checkbox" class="ballot_answer" id="answer_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" name="answer_{$T.question_num}_{$T.answer_ordering[$T.answer$index]}" value="yes" onclick="BOOTH.click_checkbox({$T.question_num}, {$T.answer_ordering[$T.answer$index]}, this.checked);" />
                                <span class="is-size-4"></span>
                        </label>
                       
                        &nbsp;&nbsp;
                        <span style={{fontSize: "12pt"}}>
                        [<a target="_blank" href="{$T.question.answer_urls[$T.answer_ordering[$T.answer$index]]}" rel="noopener noreferrer">more info</a>]
                    </span>
                      
                        </label>
                    </div>
                   
                </div>
            </div>

            <div class="columns pt-1 pb-4 buttons-question">
             
                <div class="column is-flex left-button-column">

                    <button onclick="BOOTH.previous({$T.question_num})" class="button is-medium question-button previous-button">
              <span class="icon is-small">
                <i class="fas fa-2x fa-caret-left"></i>
              </span>
                        <span>ANTERIOR</span>
                    </button>
                </div>
                <div class="column is-invisible is-flex left-button-column">
                    <button onclick="BOOTH.previous({$T.question_num})" class="button is-medium question-button previous-button">
              <span class="icon is-small">
                <i class="fas fa-2x fa-caret-left"></i>
              </span>
                        <span>ANTERIOR</span>
                    </button>
                </div>

                <div class="column is-hidden-mobile pb-0">
                    <figure class="image select-img-wrapper">
                        <img id="select-final-img" src="svg/select-img.svg"/>
                    </figure>
                </div>

                <div class="column is-flex right-button-column">

                    <button onclick="BOOTH.next({$T.question_num});" class="button is-medium question-button next-button">
                        <span>SIGUIENTE</span>
                        <span class="icon is-small">
                <i class="fas fa-2x fa-caret-right"></i>
              </span>
                    </button>
                </div>
                <div class="column is-flex right-button-column">
                    <button onclick="BOOTH.validate_and_confirm({$T.question_num});" class="button is-medium question-button proceed-button">
                        <span>FINALIZAR</span>
                        <span class="icon is-small">
                <i class="fas fa-2x fa-caret-right"></i>
              </span>
                    </button>
                </div>
       
            </div>

        </div>
    </section>
</form>
    )


}
export default Question;