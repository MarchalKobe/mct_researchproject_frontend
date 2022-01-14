import AddClassroomInput from "../types/AddClassroomInput";
import ForgotPasswordInput from "../types/forgotPasswordInput";
import JoinClassroomInput from "../types/JoinClassroomInput";
import LoginInput from "../types/loginInput";
import RegisterInput from "../types/registerInput";
import RestorePasswordInput from "../types/restorePasswordInput";

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

    const forgotPassword = (body: ForgotPasswordInput) => handleData('graphql', null, 'POST', {
        query: /* GraphQL */ `
            mutation ForgotPassword($data: ForgotPasswordInput!) {
                forgotPassword(data: $data)
            }
        `,
        variables: {
            data: {
                email: body.email,
            },
        },
    });

    const restorePassword = (token: string, body: RestorePasswordInput) => handleData('graphql', null, 'POST', {
        query: /* GraphQL */ `
            mutation RestorePassword($data: RestorePasswordInput!, $token: String!) {
                restorePassword(data: $data, token: $token)
            }
        `,
        variables: {
            data: {
                password: body.password,
            },
            token: token,
        },
    });

    const getClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetClassroom($classroomId: String!) {
                getClassroom(classroomId: $classroomId) {
                    classroomId
                    name
                    classcode
                }
            }
        `,
        variables: {
            classroomId: classroomId,
        },
    });

    const getMyJoinedClassrooms = (token: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetMyJoinedClassrooms {
                getMyJoinedClassrooms {
                    classroomId
                    name
                    userCreated {
                        userId
                    }
                }
            }
        `,
        variables: {},
    });

    const addClassroom = (token: string, body: AddClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation AddClassroom($data: AddClassroomInput!) {
                addClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                name: body.name,
            },
        },
    });

    const joinClassroom = (token: string, body: JoinClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation JoinClassroom($data: JoinClassroomInput!) {
                joinClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                classcode: body.classcode,
            },
        },
    });

    const leaveClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation LeaveClassroom($classroomId: String!) {
                leaveClassroom(classroomId: $classroomId)
            }
        `,
        variables: {
            classroomId: classroomId,
        },
    });

    return {
        register,
        login,
        confirm,
        forgotPassword,
        restorePassword,
        getClassroom,
        getMyJoinedClassrooms,
        addClassroom,
        joinClassroom,
        leaveClassroom,
    };
};
