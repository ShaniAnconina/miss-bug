const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM
import routes from './routes.js'

import { AppHeader } from './cmps/app-header.jsx'
import { AppFooter } from './cmps/app-footer.jsx'
import { UserMsg } from './cmps/user-msg.jsx'


export function App() {

    return <Router>
        <div>
            <AppHeader />
            <main>
                <Routes>
                    {routes.map(route =>
                        <Route key={route.path} element={<route.component />} path={route.path} />
                    )}
                </Routes>
            </main>
            <UserMsg />
            <AppFooter />
        </div>
    </Router>

}


