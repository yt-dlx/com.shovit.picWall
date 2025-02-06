import React from "react";
import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

const IndexPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to PicWall</Text>
      <Link href="/LoginScreen" asChild>
        <Button title="Login" />
      </Link>
      <Link href="/RegisterScreen" asChild>
        <Button title="Register" />
      </Link>
    </View>
  );
};

export default IndexPage;
