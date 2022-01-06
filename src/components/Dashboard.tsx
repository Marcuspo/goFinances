import React, { useEffect, useState } from 'react';
import { HighLightCard } from './Cards';
import {TransactionCard, TransactionCardProps} from './TransactionCard'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Container, Header, UserInfo,
	Photo,
	User,
	UserWrapper,
	UserGreeting,
	Icon,
	UserName,
	HighLightCards,
	Transactions,
	Title,
	TransactionsList,
	LogOutButton } from './styles'

export interface DetailsProps extends TransactionCardProps {
	id: string;
}

export function Dashboard(){
	const [data, setData] = useState<DetailsProps[]>([])

	async function LoadTransactions(){
		const dataKey = '@gofinance:transactions';
		const response = await AsyncStorage.getItem(dataKey);

		const transactions = response ? JSON.parse(response) : [];

		const transactionsFormated: DetailsProps[] = transactions.map((item: DetailsProps )=> {
			const amount = Number(item.amount).toLocaleString('pt-BR', {
				style: 'currency',
				currency: "BRL"
			});
			const date = Intl.DateTimeFormat('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			}).format(new Date(item.date));

			return {
				id: item.id,
				name: item.name,
				amount,
				type: item.type,
				category: item.category,
				date
			}
		});
		setData(transactionsFormated)
	}

	useEffect(() => {
		LoadTransactions()
	},[])

	return(
		<Container>
			<Header>
				<UserWrapper>
					<UserInfo>
						<Photo source={{ uri: 'https://avatars.githubusercontent.com/u/17353066?v=4'}} />
							<User>
								<UserGreeting>Olá,</UserGreeting>
								<UserName>Marcus</UserName>
							</User>
					</UserInfo>

					<LogOutButton onPress={() => {}}>
					<Icon name="power" />
					</LogOutButton>
				</UserWrapper>
			</Header>
			<HighLightCards>
				<HighLightCard
					type='up'
					title="Entradas"
					amount="R$ 17.400,00"
					lastTransaction="Última entrada dia 13 de abril"
				/>
				<HighLightCard
					type='down'
					title="Saídas"
					amount="R$ 1.259,00"
					lastTransaction="Última saída dia 03 de abril"
				/>
				<HighLightCard
					type='total'
					title="Total"
					amount="R$ 16.141,00"
					lastTransaction="01 à 16 de abril"
				/>
			</HighLightCards>

			<Transactions>
				<Title>Transações</Title>
				<TransactionsList
					data={data}
					keyExtractor={item => item.id}
					renderItem={({ item }) =>
					<TransactionCard
						data={item}
					/>
				}
				/>


			</Transactions>

		</Container>
	)
}
