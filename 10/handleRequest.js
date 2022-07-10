module.exports = ({ request, session, version }) => {
  const { command } = request;
  return {
    response: {
      text: "Привет вездекодерам!",
      tts: "Привет вездекодерам!",
      end_session: false,
    },
    session,
    version,
  };
};
