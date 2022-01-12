import LoginInput from "../types/loginInput";
import RegisterInput from "../types/registerInput";

const handleData = async (path: string, token: string | null = null, method: string = 'GET', body: any = null) => {
    const t0 = performance.now();

    const response = await fetch(`http://localhost:5001/${path}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: body === null ? null : JSON.stringify(body),
        method: method,
    }).then((result: Response) => {
        if(result.status === 429) {
            window.alert('To many requests.');
            return;
        };

        return result.json();
    }).catch(() => {
        window.alert('Something went wrong.');
    });

    const t1 = performance.now();

    console.log(`%c Time: ${(t1 - t0) / 1000} seconds - ${path}`, 'color: #7CFC00;');

    return response;
};

export const useNetwork = () => {
    const register = (body: RegisterInput) => handleData('graphql', null, 'POST', {
        query: /* GraphQL */ `
            mutation Register($data: RegisterInput!) {
                register(data: $data) {
                    userId
                }
            }
        `,
        variables: {
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: body.password,
                type: body.type,
            },
        },
    });

    const login = (body: LoginInput) => handleData('graphql', null, 'POST', {
        query: /* GraphQL */ `
            mutation Login($data: LoginInput!) {
                login(data: $data) {
                    userId
                    token
                }
            }
        `,
        variables: {
            data: {
                email: body.email,
                password: body.password,
            },
        },
    });

    const confirm = (token: string) => handleData('graphql', null, 'POST', {
        query: /* GraphQL */ `
            mutation Confirm($token: String!) {
                confirm(token: $token)
            }
        `,
        variables: {
            token: token,
        },
    });

    return {
        register,
        login,
        confirm,
    };
};
