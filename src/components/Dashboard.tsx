import React, { useEffect, useState, useCallback } from 'react';
import { HighLightCard } from './Cards';
import {TransactionCard, TransactionCardProps} from './TransactionCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFocusEffect} from '@react-navigation/native'

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
import { ActivityIndicator } from 'react-native';

export interface DetailsProps extends TransactionCardProps {
	id: string;
}

interface HighLightProps {
	amount: string;
	lastTransaction: string;
}

interface HighLightData {
	entries: HighLightProps
	expensives: HighLightProps
	total: HighLightProps
}

export function Dashboard(){
	const [isLoading, setIsLoading] = useState(true)
	const [transactions, setTransactions] = useState<DetailsProps[]>([])
	const [highLightData, setHighlighData] = useState<HighLightData>({} as HighLightData)

	async function LoadTransactions(){
		const dataKey = '@gofinance:transactions';
		const response = await AsyncStorage.getItem(dataKey);

		const transactions = response ? JSON.parse(response) : [];

		let entriesTotal = 0;
		let expensiveTotal = 0;

		function getLastTransactionDate(collection: DetailsProps[], type: 'positive' | 'negative'){

			const lastTransaction = new Date( Math.max.apply(Math, collection
				.filter(transaction => transaction.type === type)
				.map(transaction => new Date(transaction.date).getTime())
				))

			return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
				month: 'long'
			})}`

		}

		const transactionsFormated: DetailsProps[] = transactions.map((item: DetailsProps )=> {

			if(item.type === 'positive'){
				entriesTotal += Number(item.amount);
			}else {
				expensiveTotal += Number(item.amount)
			}

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
		setTransactions(transactionsFormated)

		const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive')
		const lastTransactionsExpensives= getLastTransactionDate(transactions, 'negative')
		const totalInterval = `1 a ${lastTransactionsExpensives}`

		const total = entriesTotal - expensiveTotal;

		setHighlighData({
			entries: {
				amount: entriesTotal.toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				}),
				lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
			},
			expensives: {
				amount: expensiveTotal.toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				}),
				lastTransaction: `Última saída dia ${lastTransactionsExpensives}`,
			},
			total: {
				amount: total.toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				}),
				lastTransaction: totalInterval
			}
		})
		setIsLoading(false)
	}

	useEffect(() => {
		LoadTransactions()
	},[])

	useFocusEffect(useCallback(() => {
		LoadTransactions()
	},[]))

	return(
		<Container>
			{ isLoading ? <ActivityIndicator size='large'  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} /> :
				<>
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
					amount={highLightData.entries.amount}
					lastTransaction={highLightData.entries.lastTransaction}
				/>
				<HighLightCard
					type='down'
					title="Saídas"
					amount={highLightData.expensives.amount}
					lastTransaction={highLightData.expensives.lastTransaction}
				/>
				<HighLightCard
					type='total'
					title="Total"
					amount={highLightData.total.amount}
					lastTransaction={highLightData.total.lastTransaction}
				/>
			</HighLightCards>

			<Transactions>
				<Title>Transações</Title>
				<TransactionsList
					data={transactions}
					keyExtractor={item => item.id}
					renderItem={({ item }) =>
					<TransactionCard
						data={item}
					/>
				}
				/>


			</Transactions>
				</>
			}


		</Container>
	)
}
