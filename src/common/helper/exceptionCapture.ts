export default async function(asyncFunc: () => Promise<any>) {
    try {
        const res = await asyncFunc();
        return [null, res];
    } catch (err) {
        const error: { [key: string]: any } = {};
        if (typeof err === 'string') {
            error.message = err.replace('GraphQL error: ', '');
        } else if (err !== null && typeof err === 'object' && typeof err.message === 'string') {
            error.message = err.message.replace('GraphQL error: ', '');
        }
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return [error, null];
    }
}
