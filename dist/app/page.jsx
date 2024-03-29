import { NavbarPage } from '@/components';
export default function Home() {
    return (<main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mx-auto max-w-[44rem] text-center mt-5">

        <div className="flex flex-auto">
          <h1 className=" dark:text-cyan-300 font-black flex-1 mt-3 text-7xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-7xl leading-[4rem] tracking-tight">
          CHECK🛡
          </h1>
        </div>

        <div className="mt-2 p-2">
          <p className="text-xs text-justify leading-relaxed text-slate-600 dark:text-slate-400">
          A gestão de riscos orienta a <strong className="text-xs text-black dark:text-white"> jornada para o sucesso. </strong>
          </p>
        </div>

        <div className="mt-5 p-4">
          <form>
            <div className='flex justify-center'>
              <div>
                <div className="flex  justify-center mb-4 ">
                  <input type="email" id="email" name="email" placeholder="email" className=" text-xs text-center w-full px-7 py-2 h-8 border bg-transparent text-gray-700 dark:text-white border-b border-black border-b-white focus:outline-none focus:border-b-cyan-300 dark:focus:border-b-cyan-300" required/>
                </div>

                <div className="flex mb-4">
                  <input type="password" id="senha" name="senha" placeholder="senha" className="text-xs text-center w-full px-7 py-2 h-8 border bg-transparent text-gray-700 dark:text-white border-b border-black border-b-white focus:outline-none focus:border-b-cyan-300 dark:focus:border-b-cyan-300" required/>
                </div>
                <div className="flex items-center mt-8 ">
                  <input type="checkbox" id="rememberPassword" name="rememberPassword" className="mr-1 w-3 h-3 before:content[''] peer relative cursor-pointer appearance-none border border-b-4 transition-all checked:border-cyan-300 checked:bg-cyan-300 checked:before:bg-cyan-300 hover:before:opacity-10"/>
                  <label htmlFor="rememberPassword" className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mr-5">
                    Lembrar senha
                  </label>
                
                <p className="text-xs  leading-relaxed text-slate-600 dark:text-slate-400">
                  Esqueceu sua senha?
                </p>
                </div>
                <button type="submit" className="border mt-4  text-black dark:text-white hover:decoration-white dark:hover:decoration-white hover:dark:border-cyan-300 hover:visible pb-[2px] pt-0 uppercase leading-normal transition delay-100 duration-200 ease-in focus:ring-0 active:text-gray-400 border-white px-6 border-b-4 font-lg focus:outline-none">
                  <NavbarPage page={"modelagem"} pageTitle={"Entrar"}/>
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </main>);
}
