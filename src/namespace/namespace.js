const Pipeos = {
  pipeserver: {
    ip: `${process.env.VUE_APP_PIPESERVER_IP}:${process.env.VUE_APP_PIPESERVER_PORT}`,
    jsonapi: '/json',
  },
};

export default Pipeos;
