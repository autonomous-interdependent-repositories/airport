import {
	USER_ACCOUNT_API,
} from '../../to_be_generated/common-tokens';
import {
	DEPENDENCY_INJECTION,
	Inject,
	Injected,
} from '@airport/direction-indicator';
import {
	Api,
} from '@airport/check-in';
import {
	IUserAccount,
} from '../../generated/userAccount';
import {
	UserAccountDao,
} from '../../dao/UserAccountDao';



// An API stub for other Applications and UIs to use
@Injected()
export class UserAccountApi {

    constructor() {
        DEPENDENCY_INJECTION.db().manualInject(this, USER_ACCOUNT_API)
    }
        
    @Inject()
    userAccountApi: UserAccountApi
            
    async  findUserAccount(
        privateId: string
    ): Promise<IUserAccount> {
        return await this.userAccountApi.findUserAccount(privateId)
    }

}
