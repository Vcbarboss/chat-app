import React, {useRef} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import {Colors} from "../helper/colors";

export default function Field(props) {

    const inputRef = useRef();

    const handleChange = (e) => {
        props.change(e);
    };

    return (
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
            <View style={[styles.inputContainer]}>

                <TextInput
                    placeholder={props.placeholder}
                    style={[styles.input, {
                        color: props.disabled ? Colors.grey : Colors.dark,
                        paddingBottom: Platform.OS === 'ios' ? 0 : 5
                    }]}
                    keyboardType={props.keyboardType}
                    secureTextEntry={props.secureTextEntry}
                    value={props.value}
                    ref={(ref) => inputRef.current = ref}
                    editable={!props.disabled}
                    autoFocus={props.autoFocus}
                    onChangeText={(e) => {
                        !props.disabled && handleChange(e);
                    }}
                    multiline={!!props.multiline}
                    numberOfLines={!!props.multiline ? (Platform.OS === 'ios' ? null : props.multiline) : null}
                    minHeight={!!props.multiline ? ((Platform.OS === 'ios') ? (35 * props.multiline) : null) : null}
                    maxHeight={!!props.multiline ? ((Platform.OS === 'ios') ? (35 * props.multiline) : null) : null}
                />
                {props.loading && <ActivityIndicator style={styles.rightIcon} color={Colors.secondary} size={'small'}/>}
                {props.anyComponent}
                <Text style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: -10,
                    left: 15,
                    fontWeight: 'bold',
                    color: props.color || Colors.primary
                }}> {props.label && props.label} </Text>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
        input: {
            flex: 1,
            backgroundColor: 'transparent',
            fontSize: 18,
            paddingBottom: 5
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: Colors.secondary,
            borderRadius: 20,
            marginBottom: 20,
            padding: 15,
        },
        icon: {
            marginRight: 6
        },
        rightIcon: {},
    },
);
