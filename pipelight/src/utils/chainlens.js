const CHAINLENS_API = process.env.REACT_APP_CHAINLENS_SERVER;

export async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function saveGraphOnServer(graph) {
  const api = `${CHAINLENS_API}/graph`;
  return await postData(api, graph);
}

export async function saveWasmPclass(pclassdoc, pclassidoc) {
  const pclass = await postData(`${CHAINLENS_API}/pclass`, pclassdoc);
  if (!pclass) {
    throw new Error('Could not save wasm pclass');
  }
  const pclassi = await postData(`${CHAINLENS_API}/pclasses/${pclass._id}/pclass-instances`, pclassidoc);
  if (!pclassi) {
    throw new Error('Could not save wasm pclass instance');
  }
  const countResponse = await fetch(`${CHAINLENS_API}/pclasses/${pclass._id}/pfunctions/build`);
  const count = countResponse.json();
  const expectedCount = pclass.data.gapi.length;
  if (count.count !== expectedCount) {
    throw new Error(`wasm pfunction number incorrect: expected ${expectedCount}, inserted: ${count.count}`);
  }
  return pclass;
}

export async function getDataServer(apitype, _id, filter={}) {
  let url = `${CHAINLENS_API}/${apitype}`;
  if (_id) url = `${url}/${_id}`;

  const response = await fetch(`${url}?filter=${JSON.stringify(filter)}`);
  return await response.json();
}

export async function getGraphsServer(chainid, limit, skip = 0) {
  let filter = {where: {}};
  if (limit) {
    filter.limit = limit;
  }
  if (skip) {
    filter.skip = skip;
  }
  if (chainid) {
    filter.where['data.chainid'] = chainid;
  }
  const url = `${CHAINLENS_API}/graph?filter=${JSON.stringify(filter)}`;

  const response = await fetch(url);
  return await response.json();
}
