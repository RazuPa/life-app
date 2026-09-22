import { StyleSheet, Text, TextInput, View } from "react-native";

import type {
    KeyboardTypeOptions,
    StyleProp,
    ViewStyle
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type AppInputProps = {
  label?: string;

  value: string;

  onChangeText: (text: string) => void;

  placeholder?: string;

  unit?: string;

  keyboardType?: KeyboardTypeOptions;

  multiline?: boolean;

  maxLength?: number;

  style?: StyleProp<ViewStyle>;
};

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  keyboardType = "default",
  multiline = false,
  maxLength,
  style,
}: AppInputProps) {
  const { theme } = useTheme();

  return (
    <View style={style}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          {
            backgroundColor: theme.colors.input,

            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? "top" : "center"}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            {
              color: theme.colors.text,
            },
          ]}
        />

        {unit && !multiline && (
          <Text
            style={[
              styles.unit,
              {
                color: theme.colors.muted,
              },
            ]}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 60,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 15,
  },

  multilineContainer: {
    minHeight: 110,

    alignItems: "stretch",

    paddingVertical: 14,
  },

  input: {
    flex: 1,

    fontSize: 18,
    fontWeight: "700",

    padding: 0,
  },

  multilineInput: {
    minHeight: 80,

    fontSize: 14,
    fontWeight: "400",

    lineHeight: 20,
  },

  unit: {
    fontSize: 12,
    fontWeight: "700",

    marginLeft: 6,
  },
});
