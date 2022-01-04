import React from 'react';
import { HighLightCard } from './Cards';
import {TransactionCard, TransactionCardProps} from './TransactionCard'

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
	TransactionsList } from './styles'

export interface DetailsProps extends TransactionCardProps {
	id: string;
}

export function Dashboard(){
	const data: DetailsProps[] = [{
		id: '1',
		type: 'positive',
		title: "Desenvolvimento de site",
		amount: 'R$ 12.000,00',
		category: {
			name: 'Vendas',
			icon: 'dollar-sign'
		},
		date: '13/04/2020'
	},
	{
		id: '2',
		type: 'negative',
		title: "Hamburgueria Pizzy",
		amount: 'R$ 59,00',
		category: {
			name: 'Alimentação',
			icon: 'coffee'
		},
		date: '10/04/2020'
	},
	{
		id: '3',
		type: 'negative',
		title: "Aluguel do apartamento",
		amount: 'R$ 1.000,00',
		category: {
			name: 'Casa',
			icon: 'shopping-bag'
		},
		date: '10/04/2020'
	},
]

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
					<Icon name="power" />
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
