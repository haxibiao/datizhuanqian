import api from './api';
import clientMutate from './clientMutate';

// export { clientMutate };
// export * from './api';

const service = {
    ...api,
    clientMutate,
};

export default service;
