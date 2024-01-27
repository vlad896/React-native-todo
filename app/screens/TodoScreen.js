import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { THEME } from "../theme";
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { AppCard } from "../ui/AppCard";
import { EditModal } from "../components/EditModal";
import { AppTextBold } from '../ui/AppTextBold';
import { AppButton } from '../ui/AppButton';
export const TodoScreen = ({ goBack, todo, onRemove, onSave }) => {
	const [modal, setModal] = useState(false);

	const saveHandler = (title) => {
		onSave(todo.id, title)
		setModal(false)
	}
	return (
		<View>
			<EditModal
				visible={modal}
				onClose={() => setModal(false)}
				todo={todo.title}
				onSave={saveHandler}
			/>
			<AppCard style={styles.card}>
				<AppTextBold style={styles.title}>{todo.title}</AppTextBold>
				<AppButton color={THEME.MAIN_COLOR} onPress={() => setModal(true)} >
					<FontAwesome name='edit' size={20} />
				</AppButton>
			</AppCard>

			<View style={styles.buttonContainer}>
				<View style={styles.button}>
					<AppButton color={THEME.GREY_COLOR} onPress={goBack}>
						<AntDesign name='back' size={20} color='#fff' />
					</AppButton>
				</View>
				<View style={styles.button}>
					<AppButton
						onPress={() => onRemove(todo.id)}
						color={THEME.DANGER_COLOR}
					>
						<FontAwesome name='remove' size={20} color='#fff' />
					</AppButton>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		width: "40%",


	},
	title: {
		fontSize: 20,
	},
	card: {
		marginBottom: 20,
		padding: 15,
	},
});
