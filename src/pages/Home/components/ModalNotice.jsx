import $ from "jquery";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function ModalNotice({post, index}) {
  return (
    <div className="modal" id={"info-notice" + String(index)}>
      <div
        className="modal-background"
        onClick={() => {
          $("#info-notice" + String(index)).removeClass("is-active");
        }}
      ></div>
      <div className="modal-card">
        <section className="modal-notice-body">
          <div
            className="modal-notice-sup pr-5 pb-1"
            onClick={() => {
              $("#info-notice" + String(index)).removeClass("is-active");
            }}
          >
            <span style={{ color: "red", cursor: "pointer" }}>⬤</span>
          </div>
          <div className="ml-5 mr-5 mb-4 modal-text-notice">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ModalNotice;
