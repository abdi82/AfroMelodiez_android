import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native'
import { colors } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles';

export default function ErrorToast(status, errorMessage) {
    return <Modal transparent={true} visible={status}>
        <View style={styles.toastFullContainer}>
            <View style={styles.toastInnerContainer}>
                <Text style={commonStyles.textWhiteBold(16)}>
                    {errorMessage}
                </Text>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    toastFullContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    toastInnerContainer: {
        width: '70%',
        backgroundColor: '#5a5a5a',
        padding: 12,
        maxHeight: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
    }
})