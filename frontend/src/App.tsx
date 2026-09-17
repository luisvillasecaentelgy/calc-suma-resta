import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

type Operacion = 'sumar' | 'restar'

type Resultado = {
  resultado: number
}

function formatear(valor: number) {
  if (!Number.isFinite(valor)) return 'Error'
  const texto = Number(valor.toPrecision(12)).toString()
  return texto
}

export default function App() {
  const [pantalla, setPantalla] = useState('0')
  const [operando, setOperando] = useState<number | null>(null)
  const [operacion, setOperacion] = useState<Operacion | null>(null)
  const [esperando, setEsperando] = useState(false)
  const [expresion, setExpresion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [aviso, setAviso] = useState('')
  const avisoTimer = useRef<number>(0)

  const simbolo = useCallback((op: Operacion) => (op === 'sumar' ? '+' : '−'), [])

  const noDisponible = useCallback((nombre: string) => {
    setAviso(nombre + ' no disponible')
    window.clearTimeout(avisoTimer.current)
    avisoTimer.current = window.setTimeout(() => setAviso(''), 1600)
  }, [])

  const escribirDigito = useCallback(
    (digito: string) => {
      setError('')
      setPantalla((actual) => {
        if (esperando) return digito
        if (actual === '0') return digito
        if (actual === '-0') return '-' + digito
        if (actual.replace('-', '').replace('.', '').length >= 12) return actual
        return actual + digito
      })
      if (esperando) setEsperando(false)
    },
    [esperando],
  )

  const escribirPunto = useCallback(() => {
    setError('')
    if (esperando) {
      setPantalla('0.')
      setEsperando(false)
      return
    }
    setPantalla((actual) => (actual.includes('.') ? actual : actual + '.'))
  }, [esperando])

  const cambiarSigno = useCallback(() => {
    setPantalla((actual) => {
      if (actual === '0' || actual === '0.') return actual
      return actual.startsWith('-') ? actual.slice(1) : '-' + actual
    })
  }, [])

  const borrarEntrada = useCallback(() => {
    setPantalla('0')
    setError('')
  }, [])

  const borrar = useCallback(() => {
    if (esperando) {
      borrarEntrada()
      return
    }
    setPantalla((actual) => {
      if (actual.length <= 1 || actual === '-0') return '0'
      if (actual.length === 2 && actual.startsWith('-')) return '0'
      return actual.slice(0, -1)
    })
  }, [borrarEntrada, esperando])

  const limpiar = useCallback(() => {
    setPantalla('0')
    setOperando(null)
    setOperacion(null)
    setEsperando(false)
    setExpresion('')
    setError('')
  }, [])

  const calcularEnBackend = useCallback(async (a: number, b: number, op: Operacion) => {
    setCargando(true)
    setError('')
    try {
      const respuesta = await fetch('/api/calc/' + op, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a, b }),
      })
      if (!respuesta.ok) throw new Error('operacion')
      const data = (await respuesta.json()) as Resultado
      return data.resultado
    } catch {
      setError('Sin conexión con el backend')
      return null
    } finally {
      setCargando(false)
    }
  }, [])

  const elegirOperacion = useCallback(
    async (siguiente: Operacion) => {
      const actual = Number(pantalla)
      if (operando !== null && operacion && !esperando) {
        const resultado = await calcularEnBackend(operando, actual, operacion)
        if (resultado === null) return
        const texto = formatear(resultado)
        setPantalla(texto)
        setOperando(resultado)
        setOperacion(siguiente)
        setEsperando(true)
        setExpresion(`${texto} ${simbolo(siguiente)}`)
        return
      }

      setOperando(actual)
      setOperacion(siguiente)
      setEsperando(true)
      setExpresion(`${pantalla} ${simbolo(siguiente)}`)
    },
    [calcularEnBackend, esperando, operacion, operando, pantalla, simbolo],
  )

  const igual = useCallback(async () => {
    if (operando === null || !operacion) return
    const actual = Number(pantalla)
    const resultado = await calcularEnBackend(operando, actual, operacion)
    if (resultado === null) return
    setPantalla(formatear(resultado))
    setOperando(null)
    setOperacion(null)
    setEsperando(true)
    setExpresion('')
  }, [calcularEnBackend, operacion, operando, pantalla])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (cargando) return
      const tecla = event.key

      if (/^[0-9]$/.test(tecla)) {
        event.preventDefault()
        escribirDigito(tecla)
        return
      }
      if (tecla === '.' || tecla === ',') {
        event.preventDefault()
        escribirPunto()
        return
      }
      if (tecla === '+') {
        event.preventDefault()
        void elegirOperacion('sumar')
        return
      }
      if (tecla === '-') {
        event.preventDefault()
        void elegirOperacion('restar')
        return
      }
      if (tecla === '*' || tecla === 'x' || tecla === 'X') {
        event.preventDefault()
        noDisponible('Multiplicar')
        return
      }
      if (tecla === '/') {
        event.preventDefault()
        noDisponible('Dividir')
        return
      }
      if (tecla === 'Enter' || tecla === '=') {
        event.preventDefault()
        void igual()
        return
      }
      if (tecla === 'Escape') {
        event.preventDefault()
        limpiar()
        return
      }
      if (tecla === 'Backspace') {
        event.preventDefault()
        borrar()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [borrar, cargando, elegirOperacion, escribirDigito, escribirPunto, igual, limpiar, noDisponible])

  return (
    <main className="page">
      <section className="calculator" aria-label="Calculadora de suma y resta">
        <header className="brand">
          <span>CriterIA</span>
          <strong>SUMA / RESTA</strong>
        </header>

        <div className="display" role="status" aria-live="polite">
          <span className="expression">{aviso || expresion || '\u00a0'}</span>
          <span className="value">{cargando ? '…' : pantalla}</span>
          {error && <span className="error">{error}</span>}
        </div>

        <div className="keys">
          <button type="button" className="key fn area-c" onClick={limpiar} disabled={cargando}>
            C
          </button>
          <button type="button" className="key fn area-sign" onClick={cambiarSigno} disabled={cargando} aria-label="Cambiar signo">
            ±
          </button>
          <button type="button" className="key fn area-back" onClick={borrarEntrada} disabled={cargando} aria-label="Borrar entrada">
            CE
          </button>
          <button
            type="button"
            className="key op soon area-div"
            onClick={() => noDisponible('Dividir')}
            aria-label="Dividir, no disponible"
            title="Próximamente"
          >
            ÷
          </button>

          <button type="button" className="key area-n7" onClick={() => escribirDigito('7')} disabled={cargando}>7</button>
          <button type="button" className="key area-n8" onClick={() => escribirDigito('8')} disabled={cargando}>8</button>
          <button type="button" className="key area-n9" onClick={() => escribirDigito('9')} disabled={cargando}>9</button>
          <button
            type="button"
            className="key op soon area-mul"
            onClick={() => noDisponible('Multiplicar')}
            aria-label="Multiplicar, no disponible"
            title="Próximamente"
          >
            ×
          </button>

          <button type="button" className="key area-n4" onClick={() => escribirDigito('4')} disabled={cargando}>4</button>
          <button type="button" className="key area-n5" onClick={() => escribirDigito('5')} disabled={cargando}>5</button>
          <button type="button" className="key area-n6" onClick={() => escribirDigito('6')} disabled={cargando}>6</button>
          <button type="button" className="key op area-minus" onClick={() => elegirOperacion('restar')} disabled={cargando}>
            −
          </button>

          <button type="button" className="key area-n1" onClick={() => escribirDigito('1')} disabled={cargando}>1</button>
          <button type="button" className="key area-n2" onClick={() => escribirDigito('2')} disabled={cargando}>2</button>
          <button type="button" className="key area-n3" onClick={() => escribirDigito('3')} disabled={cargando}>3</button>
          <button type="button" className="key op area-plus" onClick={() => elegirOperacion('sumar')} disabled={cargando}>
            +
          </button>

          <button type="button" className="key zero area-n0" onClick={() => escribirDigito('0')} disabled={cargando}>0</button>
          <button type="button" className="key area-dot" onClick={escribirPunto} disabled={cargando}>.</button>
          <button type="button" className="key eq area-eq" onClick={() => igual()} disabled={cargando}>
            =
          </button>
        </div>
      </section>
    </main>
  )
}
