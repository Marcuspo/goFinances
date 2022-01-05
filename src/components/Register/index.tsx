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

interface FormData {
	name: string;
	amount: string;
}

const schema = Yup.object().shape({
	name: Yup.string().required("Nome é obrigatório"),
	amount: Yup.number().typeError("Informe um valor númerico").positive("O valor não pode ser negativo").required("O valor tem que ser válido")
})

export function Register(){

	const [category, setCategory] = useState({
		key: 'category',
		name: 'Categoria',
	})
	const [transactionType, setTransactionType] = useState('');
	const [categoryOpen, setCategoryOpen] = useState(false);

	const { control, handleSubmit, formState: {errors}} = useForm({
		resolver: yupResolver(schema)
	});

	function handleTransactionTypeSelect(type: 'up' | 'down'){
		setTransactionType(type)
	}

	function handleOpenSelectCategory(){
		setCategoryOpen(true)
	}

	function handleCloseSelectCategory(){
		setCategoryOpen(false)
	}

	function handleRegister(form: FormData){

		if(!transactionType)
		return Alert.alert('Selecione o tipo de transação')

		if(category.key === "category")
			return Alert.alert("Selecione a categoria")

		const data = {
			name: form.name,
			amount: form.amount,
			transactionType,
			category: category.key
		}
		console.log(data)
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
							title="Income"
							onPress={() => {handleTransactionTypeSelect('up')}}
							isActive={transactionType === 'up'}
						/>
						<TransactionTypeButton
							type='down'
							title="Outcome"
							onPress={() => {handleTransactionTypeSelect('down')}}
							isActive={transactionType === 'down'}
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
