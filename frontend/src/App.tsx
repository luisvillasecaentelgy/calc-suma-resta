import { FormEvent, useState } from 'react'
import './App.css'

type Operacion = 'sumar' | 'restar'

type Resultado = {
  a: number
  b: number
  operacion: string
  resultado: number
}

export default function App() {
  const [a, setA] = useState('8')
  const [b, setB] = useState('3')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function calcular(operacion: Operacion, event?: FormEvent) {
    event?.preventDefault()
    setError('')
    setCargando(true)

    try {
      const respuesta = await fetch('/api/calc/' + operacion, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: Number(a), b: Number(b) }),
      })

      if (!respuesta.ok) {
        throw new Error('El backend no pudo calcular la operación')
      }

      const data = (await respuesta.json()) as Resultado
      setResultado(data)
    } catch {
      setResultado(null)
      setError('No se pudo conectar con el backend. ¿Está levantado en el puerto 8080?')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">CriterIA</p>
        <h1>Calculadora de suma y resta</h1>
        <p className="lede">
          Solo dos operaciones, con React en el frontend y Spring Boot en el backend.
        </p>

        <form className="form" onSubmit={(event) => calcular('sumar', event)}>
          <label>
            Número A
            <input
              type="number"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
              required
            />
          </label>
          <label>
            Número B
            <input
              type="number"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
              required
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={cargando}>
              {cargando ? 'Calculando…' : 'Sumar'}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={cargando}
              onClick={() => calcular('restar')}
            >
              Restar
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}

        {resultado && (
          <div className="result" role="status">
            <span>{resultado.a}</span>
            <span>{resultado.operacion === 'suma' ? '+' : '−'}</span>
            <span>{resultado.b}</span>
            <span>=</span>
            <strong>{resultado.resultado}</strong>
          </div>
        )}
      </section>
    </main>
  )
}
