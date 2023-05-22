import React, { useState } from "react";

function ScrollButton() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);
  if (visible) {
    return (
      <p className="icon-flotant" onClick={scrollToTop}>
        ▲
      </p>
    );
  } else {
    return <></>;
  }
}

export default ScrollButton;
