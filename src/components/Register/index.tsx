import React, { useState } from 'react'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { Button } from '../Form/Button'
import { CategorySelectButton } from '../Form/Category'

import { TransactionTypeButton } from '../Form/TransactionButton'

import { Container, Header, Title, Form, Fields, TransactionTypes} from './styles'

import { CategorySelect } from '../../screens/CategorySelect'
import { InputForm } from '../Form/InputForm';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface FormData {
	name: string;
	amount: string;
}

const schema = Yup.object().shape({
	name: Yup.string().required("Nome é obrigatório"),
	amount: Yup.number().typeError("Informe um valor númerico").positive("O valor não pode ser negativo").required("O valor tem que ser válido")
})

export function Register(){

	const { user } = useAuth();

	const navigation = useNavigation()

	const [category, setCategory] = useState({
		key: 'category',
		name: 'Categoria',
	})
	const [transactionType, setTransactionType] = useState('');
	const [categoryOpen, setCategoryOpen] = useState(false);


	const { control, reset, handleSubmit, formState: {errors}} = useForm({
		resolver: yupResolver(schema)
	});

	function handleTransactionTypeSelect(type: 'positive' | 'negative'){
		setTransactionType(type)
	}

	function handleOpenSelectCategory(){
		setCategoryOpen(true)
	}

	function handleCloseSelectCategory(){
		setCategoryOpen(false)
	}

	async function handleRegister(form: FormData){

		if(!transactionType)
		return Alert.alert('Selecione o tipo de transação')

		if(category.key === "category")
			return Alert.alert("Selecione a categoria")

		const newTransaction = {
			id: String(uuid.v4()),
			name: form.name,
			amount: form.amount,
			type: transactionType,
			category: category.key,
			date: new Date(),
		}

		try {
			const dataKey =`@gofinance:transactions_user:${user.id}`
			const data = await AsyncStorage.getItem(dataKey)
			const currentData = data ? JSON.parse(data) : [];

			const dataformatted = [
				...currentData,
				newTransaction
			]

			await AsyncStorage.setItem(dataKey, JSON.stringify(dataformatted));
			reset()
			setTransactionType('')
			setCategory({
				key: 'category',
				name: 'Categoria'
			})
			navigation.navigate('Listagem');

		} catch (error) {
			console.log(error);
			Alert.alert("Não foi possível salvar");
		}
	}

	return(
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<Container>


			<Header>
				<Title>Cadastro</Title>
			</Header>
			<Form>
			<Fields>

				<InputForm name="name" control={control} placeholder="Nome" autoCapitalize="sentences" autoCorrect={false} error={errors.name && errors.name.message}/>
				<InputForm name="amount" control={control} placeholder="Preço" keyboardType='numeric' error={errors.amount && errors.amount.message} />


					<TransactionTypes>
						<TransactionTypeButton
							type='up'
							title="Entrada"
							onPress={() => {handleTransactionTypeSelect('positive')}}
							isActive={transactionType === 'positive'}
						/>
						<TransactionTypeButton
							type='down'
							title="Saída"
							onPress={() => {handleTransactionTypeSelect('negative')}}
							isActive={transactionType === 'negative'}
						/>
					</TransactionTypes>
					<CategorySelectButton title={category.name} onPress={handleOpenSelectCategory} />

			</Fields>
				<Button title="Cadastrar" onPress={handleSubmit(handleRegister)} />
			</Form>

			<Modal visible={categoryOpen}>
				<CategorySelect
					category={category}
					setCategory={setCategory}
					closeSelectCategory={handleCloseSelectCategory}
				/>
			</Modal>
		</Container>
		</TouchableWithoutFeedback>
	)
}
