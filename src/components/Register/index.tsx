import React, { useState } from 'react'
import { Button } from '../Form/Button'
import { CategorySelect } from '../Form/Category'
import { Input } from '../Form/Input'
import { TransactionTypeButton } from '../Form/TransactionButton'

import { Container, Header, Title, Form, Fields, TransactionTypes} from './styles'
export function Register(){

	const [transactionType, setTransactionType] = useState('');

	function handleTransactionTypeSelect(type: 'up' | 'down'){
		setTransactionType(type)
	}

	return(
		<Container>
			<Header>
				<Title>Cadastro</Title>
			</Header>
			<Form>
			<Fields>
				<Input placeholder="Nome" />
				<Input placeholder="Preço" />
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
					<CategorySelect title="Category" />

			</Fields>
				<Button title="Cadastrar" />
			</Form>
		</Container>
	)
}
