import supabaseClient from '../utils/supabaseClient';

export async function userSignup(email, password, name, area, aadarno) {
    const signup = await supabaseClient.auth.signUp({
        email:email, password: password,
        options: {
            data: { name: name, area: area, aadarno: "" }
        }
    })
    if(signup.error) {
        return {
            type: "error",
            userdata: signup.error.message
        }
    }
    if(signup.user) {
        
        console.log("User Entered")
        const { data, error } = await supabaseClient
        .from('users')
        .insert([
            { id: signup.user.id, name: name, email: email, areaC: area, aadarno: "" },
        ])
        if(error) {
            return {
                type: "error",
                userdata: "Error while creating user"
            }
        }
        if(data) {
            console.log("User created")
            return {
                type: "success",
                userdata: signup,
            }
        }
    }    
}

export async function userSignin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email:email, password: password,
    })
    return {
        data, error
    }
}

export async function userSignout() {
    const signout = await supabaseClient.auth.signOut();
    return signout;
}