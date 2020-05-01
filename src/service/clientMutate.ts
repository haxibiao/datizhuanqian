import { app } from '@src/store';
import { Loading } from '@src/components';

interface MutationProps {
    mutation: any;
    variables: {
        [key: string]: any;
    };
    options?: any;
    showError?: boolean;
    dispatch?: Function;
    onFaild?: Function;
}

export default function(props: MutationProps) {
    const { mutation, variables, options, showError = true, dispatch, onFaild } = props;
    Loading.show();
    app.mutationClient
        .mutate({
            mutation,
            variables,
            ...options,
            errorPolicy: 'all',
        })
        .then((result: any) => {
            Loading.hide();
            if (result && result.errors) {
                let str = result.errors[0].message;

                onFaild ? onFaild(str) : Toast.show({ content: str });
            } else {
                dispatch && dispatch(result);
            }
        })
        .catch((error: any) => {
            Loading.hide();
            showError && Toast.show({ content: error.toString().replace(/Error: GraphQL error: /, ''), layout: 'top' });
        });
}
