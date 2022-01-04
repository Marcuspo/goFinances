import React from 'react';
import { HighLightCard } from './Cards';

import { Container, Header, UserInfo,
	Photo,
	User,
	UserWrapper,
	UserGreeting,
	Icon,
	UserName,
	HighLightCards } from './styles'

export function Dashboard(){
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
		</Container>
	)
}
