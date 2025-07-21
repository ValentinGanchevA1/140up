import React, { memo } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input = (props: TextInputProps) => {
	return (
		<TextInput
			style={styles.input}
			placeholderTextColor="#888"
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		marginBottom: 15,
		fontSize: 16,
	},
});

export default memo(Input);
