import { useId } from "react";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import type {
  KeyboardTypeOptions,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type AppInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
};

export default function AppInput({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
}: AppInputProps) {
  const { theme } = useTheme();

  // Each input needs its own accessory-view ID so iOS knows
  // which toolbar belongs to the currently focused input.
  const generatedId = useId();

  const accessoryId =
    `app-input-${generatedId.replace(/:/g, "")}`;

  return (
    <>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        keyboardType={keyboardType}
        multiline={multiline}

        // Connect the keyboard to our custom toolbar on iOS.
        inputAccessoryViewID={
          Platform.OS === "ios"
            ? accessoryId
            : undefined
        }

        // Gives normal keyboards a Done action as well.
        returnKeyType="done"

        // For single-line inputs, pressing the keyboard's
        // Return/Done key dismisses it.
        onSubmitEditing={() => {
          if (!multiline) {
            Keyboard.dismiss();
          }
        }}

        style={[
          styles.input,

          multiline &&
            styles.multiline,

          {
            color: theme.colors.text,
            backgroundColor:
              theme.colors.input,
            borderColor:
              theme.colors.border,
          },
        ]}
      />

      {/* ======================================================
          iOS KEYBOARD TOOLBAR

          Important for decimal-pad / number-pad because those
          keyboards don't normally contain a Done button.
          ====================================================== */}

      {Platform.OS === "ios" && (
        <InputAccessoryView
          nativeID={accessoryId}
        >
          <View
            style={[
              styles.keyboardToolbar,
              {
                backgroundColor:
                  theme.colors.card,

                borderTopColor:
                  theme.colors.border,
              },
            ]}
          >
            <Pressable
              onPress={Keyboard.dismiss}
              hitSlop={10}
              style={({ pressed }) => [
                styles.doneButton,

                pressed && {
                  opacity: 0.55,
                },
              ]}
            >
              <TextInputDoneLabel
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </>
  );
}

/*
 * Tiny internal component so AppInput doesn't need to depend
 * on AppText. This keeps the basic input component independent.
 */
function TextInputDoneLabel({
  color,
}: {
  color: string;
}) {
  return (
    <View>
      <TextLabel color={color} />
    </View>
  );
}

function TextLabel({
  color,
}: {
  color: string;
}) {
  // require here would be unnecessary; React Native View cannot
  // render text directly, so this small component uses Text.
  const { Text } = require("react-native");

  return (
    <Text
      style={[
        styles.doneText,
        { color },
      ]}
    >
      Done
    </Text>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  multiline: {
    minHeight: 100,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  // ----------------------------------------------------------
  // KEYBOARD TOOLBAR
  // ----------------------------------------------------------

  keyboardToolbar: {
    minHeight: 46,
    borderTopWidth:
      StyleSheet.hairlineWidth,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  doneButton: {
    minWidth: 58,
    minHeight: 32,

    alignItems: "center",
    justifyContent: "center",
  },

  doneText: {
    fontSize: 16,
    fontWeight: "700",
  },
});