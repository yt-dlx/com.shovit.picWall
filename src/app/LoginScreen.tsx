import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ResponseType } from "expo-auth-session";
import * as Crypto from "expo-crypto";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: ResponseType.IdToken,
    clientId: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID", // TODO: Replace with your actual client ID and set GOOGLE_CLIENT_ID in .env.local
    scopes: ["profile", "email"]
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleLogin(idToken);
      } else {
        Alert.alert("Google Login Failed", "Could not retrieve Google ID token.");
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    if (!idToken) {
      Alert.alert("Google Login Failed", "Could not retrieve Google ID token");
      return;
    }

    try {
      const googleLoginResponse = await fetch("/api/auth/google-login", {
        // Assuming server endpoint is /api/auth/google-login
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      });

      const googleLoginData = await googleLoginResponse.json();

      if (googleLoginResponse.ok) {
        Alert.alert("Google Login Successful", "Welcome!");
        // TODO: Navigate to home screen or store user session
      } else {
        Alert.alert("Google Login Failed", googleLoginData.error || "Google login failed");
      }
    } catch (googleLoginError) {
      console.error("Google Login error:", googleLoginError);
      Alert.alert("Google Login Failed", "An error occurred during Google login");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        // Assuming server endpoint is /api/auth/login
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Login Successful", "Welcome!");
        // TODO: Navigate to home screen or store user session
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "An error occurred during login");
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginTop: 20 }}>
        <Button title="Login with Google" disabled={!request} onPress={() => promptAsync()} />
      </View>
    </View>
  );
};

export default LoginScreen;
