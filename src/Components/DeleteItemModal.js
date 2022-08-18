import React from 'react'
import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { windowHeight, windowWidth } from '../constants/globalConstants'
import { colors } from '../constants/colors'
import { commonStyles } from '../constants/commonStyles'

export const DeleteItemModal = ({ isVisible, buttonText, showHideDeleteConfirmationModal, info, onDeletePress }) => {
    return (
        <Modal transparent={true} visible={isVisible} onRequestClose={showHideDeleteConfirmationModal}>
            <View style={styles.likeModalContainer}>
                <View style={styles.deleteModalInnerContainer}>
                    <Text style={commonStyles.textWhiteBold(24, { color: colors.green, alignSelf: 'center', marginTop: 10 })}>
                        {info}
                    </Text>
                    <View style={styles.deleteButtonsContainer}>
                        <TouchableOpacity onPress={onDeletePress} style={styles.confirmButton}>
                            <Text style={commonStyles.textWhiteNormal(18)}>
                                {buttonText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showHideDeleteConfirmationModal} style={styles.cancelButton}>
                            <Text style={commonStyles.textWhiteNormal(18, { color: colors.green })}>
                                Cancel
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    likeModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },
    deleteModalInnerContainer: { height: windowHeight * 0.25, width: windowWidth * 0.9, borderRadius: 12, backgroundColor: colors.white, padding: 20 },
    deleteButtonsContainer: { flexDirection: 'row', marginTop: 30, width: '100%', justifyContent: 'space-between' },
    confirmButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.green },
    cancelButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.white, borderColor: colors.green, borderWidth: 1 }
})