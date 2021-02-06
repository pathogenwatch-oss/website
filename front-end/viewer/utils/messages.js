function show(message, timeout = 6 * 1000) {
  document.querySelector('#message-snackbar')
    .MaterialSnackbar
    .showSnackbar({
      message,
      timeout,
    });
}

export default {
  show,
};
