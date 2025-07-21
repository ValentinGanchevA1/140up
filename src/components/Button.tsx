import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  TextStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  // Allow passing custom styles for the text
  textStyle?: TextStyle;
  // Indicates if the button is in a loading state
  loading?: boolean;
}

const Button = ({
                  title,
                  style,
                  textStyle,
                  loading = false,
                  disabled = false,
                  ...props
                }: ButtonProps) => {
  // A button is effectively disabled if it's in a loading state
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        // Apply a different style when the button is disabled
        isDisabled && styles.disabledButton,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        // Show an activity indicator when loading
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        // Otherwise, show the button title
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // A muted color for disabled state
    opacity: 0.7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default memo(Button);
