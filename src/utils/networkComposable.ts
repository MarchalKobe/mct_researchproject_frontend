import AddAssignmentInput from '../types/AddAssignmentInput';
import AddCategoryInput from '../types/AddCategoryInput';
import AddClassroomInput from '../types/AddClassroomInput';
import DeleteUserFromClassroomInput from '../types/DeleteUserFromClassroomInput';
import DupplicateClassroomInput from '../types/DupplicateClassroomInput';
import ForgotPasswordInput from '../types/ForgotPasswordInput';
import InviteUserToClassroomInput from '../types/InviteUserToClassroomInput';
import JoinClassroomInput from '../types/JoinClassroomInput';
import Level from '../types/Level';
import LoginInput from '../types/LoginInput';
import RegisterInput from '../types/RegisterInput';
import RestorePasswordInput from '../types/RestorePasswordInput';
import Score from '../types/Score';
import UpdateAssignmentInput from '../types/UpdateAssignmentInput';
import UpdateCategoryInput from '../types/UpdateCategoryInput';
import UpdateClassroomInput from '../types/UpdateClassroomInput';
import UpdateEditorInput from '../types/UpdateEditorInput';
import UpdateEmailInput from '../types/UpdateEmailInput';
import UpdateGeneralInput from '../types/UpdateGeneralInput';
import UpdatePasswordInput from '../types/UpdatePasswordInput';

const handleData = async (path: string, token: string | null = null, method: string = 'GET', body: any = null) => {
    const t0 = performance.now();

    // const response = await fetch(`http://localhost:5001/${path}`, {
    const response = await fetch(`http://192.168.1.100:5001/${path}`, {
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
    console.log({ response });

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

    const updateAccountGeneral = (token: string, body: UpdateGeneralInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateAccountGeneral($data: UpdateGeneralInput!) {
                updateAccountGeneral(data: $data)
            }
        `,
        variables: {
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
            },
        },
    });

    const updateAccountEmail = (token: string, body: UpdateEmailInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateAccountEmail($data: UpdateEmailInput!) {
                updateAccountEmail(data: $data)
            }
        `,
        variables: {
            data: {
                email: body.email,
            },
        },
    });

    const updateAccountPassword = (token: string, body: UpdatePasswordInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateAccountPassword($data: UpdatePasswordInput!) {
                updateAccountPassword(data: $data)
            }
        `,
        variables: {
            data: {
                current: body.current,
                password: body.password,
            },
        },
    });

    const updateAccountEditor = (token: string, body: UpdateEditorInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateAccountEditor($data: UpdateEditorInput!) {
                updateAccountEditor(data: $data)
            }
        `,
        variables: {
            data: {
                preferredTheme: body.preferredTheme,
            },
        },
    });

    const getUser = (token: string, userId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetUser($userId: String!) {
                getUser(userId: $userId) {
                    userId
                    firstName
                    lastName
                    avatar
                }
            }
        `,
        variables: {
            userId: userId,
        },
    });

    const getClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetClassroom($classroomId: String!) {
                getClassroom(classroomId: $classroomId) {
                    classroomId
                    name
                    classcode
                    open
                    users {
                        userId
                        firstName
                        lastName
                        type
                        avatar
                    }
                    userCreated {
                        userId
                    }
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
                    open
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

    const updateClassroom = (token: string, body: UpdateClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateClassroom($data: UpdateClassroomInput!) {
                updateClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                classroomId: body.classroomId,
                name: body.name,
            },
        },
    });

    const dupplicateClassroom = (token: string, body: DupplicateClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation DupplicateClassroom($data: DupplicateClassroomInput!) {
                dupplicateClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                classroomId: body.classroomId,
                name: body.name,
            },
        },
    });

    const closeClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation CloseClassroom($classroomId: String!) {
                closeClassroom(classroomId: $classroomId)
            }
        `,
        variables: {
            classroomId: classroomId,
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

    const resetClasscode = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation ResetClasscode($classroomId: String!) {
                resetClasscode(classroomId: $classroomId)
            }
        `,
        variables: {
            classroomId: classroomId,
        },
    });

    const deleteUserFromClassroom = (token: string, data: DeleteUserFromClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation DeleteUserFromClassroom($data: DeleteUserFromClassroomInput!) {
                deleteUserFromClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                userId: data.userId,
                classroomId: data.classroomId,
            }
        },
    });

    const inviteUserToClassroom = (token: string, data: InviteUserToClassroomInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation InviteUserToClassroom($data: InviteUserToClassroomInput!) {
                inviteUserToClassroom(data: $data)
            }
        `,
        variables: {
            data: {
                email: data.email,
                classroomId: data.classroomId,
            }
        },
    });

    const getCategory = (token: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetCategory($categoryId: String!) {
                getCategory(categoryId: $categoryId) {
                    categoryId
                    name
                    visible
                    done
                }
            }
        `,
        variables: {
            categoryId: categoryId,
        },
    });

    const getCurrentCategoryByClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetCurrentCategoryByClassroom($classroomId: String!) {
                getCurrentCategoryByClassroom(classroomId: $classroomId) {
                    categoryId
                    name
                }
            }
        `,
        variables: {
            classroomId: classroomId,
        },
    });

    const getCategoriesByClassroom = (token: string, classroomId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetCategoriesByClassroom($classroomId: String!) {
                getCategoriesByClassroom(classroomId: $classroomId) {
                    categoryId
                    name
                    done
                }
            }
        `,
        variables: {
            classroomId: classroomId,
        },
    });

    const addCategory = (token: string, data: AddCategoryInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation AddCategory($data: AddCategoryInput!) {
                addCategory(data: $data)
            }
        `,
        variables: {
            data: {
                name: data.name,
                classroomId: data.classroomId,
            },
        },
    });

    const updateCategory = (token: string, data: UpdateCategoryInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateCategory($data: UpdateCategoryInput!) {
                updateCategory(data: $data)
            }
        `,
        variables: {
            data: {
                categoryId: data.categoryId,
                name: data.name,
                visible: data.visible,
                done: data.done,
            },
        },
    });

    const deleteCategory = (token: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation DeleteCategory($categoryId: String!) {
                deleteCategory(categoryId: $categoryId)
            }
        `,
        variables: {
            categoryId: categoryId,
        },
    });

    const getMyAssignmentsByCategory = (token: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetMyAssignmentsByCategory($categoryId: String!) {
                getMyAssignmentsByCategory(categoryId: $categoryId) {
                    assignmentId
                    subject
                    position
                    category {
                        name
                    }
                    levels {
                        levelId
                        level
                        scores {
                            scoreId
                            status
                        }
                    }
                }
            }
        `,
        variables: {
            categoryId: categoryId,
        },
    });

    const getAssignmentsByCategory = (token: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetAssignmentsByCategory($categoryId: String!) {
                getAssignmentsByCategory(categoryId: $categoryId) {
                    assignmentId
                    subject
                    position
                    category {
                        categoryId
                        name
                    }
                    levels {
                        levelId
                        level
                        status
                        scores {
                            scoreId
                            scores
                            status
                            user {
                                userId
                                firstName
                                lastName
                            }
                        }
                    }
                }
            }
        `,
        variables: {
            categoryId: categoryId,
        },
    });

    const addAssignment = (token: string, data: AddAssignmentInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation AddAssignment($data: AddAssignmentInput!) {
                addAssignment(data: $data)
            }
        `,
        variables: {
            data: {
                subject: data.subject,
                categoryId: data.categoryId,
            },
        },
    });

    const updateAssignment = (token: string, data: UpdateAssignmentInput) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateAssignment($data: UpdateAssignmentInput!) {
                updateAssignment(data: $data)
            }
        `,
        variables: {
            data: {
                assignmentId: data.assignmentId,
                subject: data.subject,
                position: data.position,
            },
        },
    });

    const deleteAssignment = (token: string, assignmentId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation DeleteAssignment($assignmentId: String!) {
                deleteAssignment(assignmentId: $assignmentId)
            }
        `,
        variables: {
            assignmentId: assignmentId,
        },
    });

    const getLevel = (token: string, levelId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetLevel($levelId: String!) {
                getLevel(levelId: $levelId) {
                    levelId
                    level
                    description
                    status
                    assignment {
                        assignmentId
                        category {
                            categoryId
                            name
                        }
                        subject
                    }
                    code
                    startcode
                }
            }
        `,
        variables: {
            levelId: levelId,
        },
    });

    const updateLevel = (token: string, data: Level) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateLevel($data: UpdateLevelInput!) {
                updateLevel(data: $data)
            }
        `,
        variables: {
            data: {
                levelId: data.levelId,
                description: data.description,
                status: data.status,
                code: JSON.stringify(data.code),
                startcode: JSON.stringify(data.startcode),
            },
        },
    });

    const getScore = (token: string, scoreId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetScore($scoreId: String!) {
                getScore(scoreId: $scoreId) {
                    scoreId
                    code
                    level {
                        levelId
                        level
                        description
                        code
                        startcode
                        assignment {
                            assignmentId
                            subject
                            category {
                                categoryId
                                name
                            }
                        }
                    }
                }
            }
        `,
        variables: {
            scoreId: scoreId,
        },
    });

    const getMyScoresByCategory = (token: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetMyScoresByCategory($categoryId: String!) {
                getMyScoresByCategory(categoryId: $categoryId) {
                    assignmentId
                    subject
                    category {
                        categoryId
                        name
                    }
                    levels {
                        levelId
                        level
                        scores {
                            scoreId
                            scores
                            updated_at
                        }
                    }
                }
            }
        `,
        variables: {
            categoryId: categoryId,
        },
    });

    const getUserScoresByCategory = (token: string, userId: string, categoryId: string) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            query GetUserScoresByCategory($categoryId: String!, $userId: String!) {
                getUserScoresByCategory(categoryId: $categoryId, userId: $userId) {
                    assignmentId
                    subject
                    category {
                        categoryId
                        name
                    }
                    levels {
                        levelId
                        level
                        scores {
                            scoreId
                            scores
                            updated_at
                        }
                    }
                }
            }
        `,
        variables: {
            categoryId: categoryId,
            userId: userId,
        },
    });

    const updateScore = (token: string, data: Score) => handleData('graphql', token, 'POST', {
        query: /* GraphQL */ `
            mutation UpdateScore($data: UpdateScoreInput!) {
                updateScore(data: $data)
            }
        `,
        variables: {
            data: {
                scoreId: data.scoreId,
                status: data.status,
                code: JSON.stringify(data.code),
            },
        },
    });

    return {
        register,
        login,
        confirm,
        forgotPassword,
        restorePassword,
        updateAccountGeneral,
        updateAccountEmail,
        updateAccountPassword,
        updateAccountEditor,
        getUser,
        getClassroom,
        getMyJoinedClassrooms,
        addClassroom,
        updateClassroom,
        dupplicateClassroom,
        closeClassroom,
        joinClassroom,
        leaveClassroom,
        resetClasscode,
        deleteUserFromClassroom,
        inviteUserToClassroom,
        getCategory,
        getCurrentCategoryByClassroom,
        getCategoriesByClassroom,
        addCategory,
        updateCategory,
        deleteCategory,
        getMyAssignmentsByCategory,
        getAssignmentsByCategory,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        getLevel,
        updateLevel,
        getScore,
        getMyScoresByCategory,
        getUserScoresByCategory,
        updateScore,
    };
};
