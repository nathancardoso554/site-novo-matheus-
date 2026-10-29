import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D_lbECi6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLANILHA_URL = "https://script.google.com/macros/s/AKfycbx78lTPgWWnl3CDPoGsiwUefmsFPr1A8CfhzqPhKtx3aD04LG7ToVpW3uUJt7gCQVf2/exec";
var NUMERO_MATHEUS = "554891578079";
var INSTAGRAM_URL = "https://instagram.com/matheus_delalibera_";
var WHATSAPP_URL = `https://wa.me/${NUMERO_MATHEUS}`;
var EMPTY = {
	nome: "",
	idade: "",
	sexo: "",
	peso: "",
	altura: "",
	objetivo: "",
	mudanca: "",
	treina: "",
	experiencia: "",
	dias: "",
	alimentacao: "",
	rotina: "",
	dificuldade: "",
	whatsapp: ""
};
var STEPS = [
	"Você",
	"Objetivo",
	"Treino",
	"Rotina",
	"Contato"
];
function validateStep(step, d) {
	const e = {};
	if (step === 1) {
		if (d.nome.trim().length < 2) e.nome = "Informe seu nome completo.";
		const idade = Number(d.idade);
		if (!d.idade.trim()) e.idade = "Informe sua idade.";
		else if (!Number.isFinite(idade) || idade < 12 || idade > 100) e.idade = "Informe uma idade entre 12 e 100 anos.";
		if (!d.sexo) e.sexo = "Selecione uma opção.";
		if (d.peso && (Number(d.peso) < 30 || Number(d.peso) > 300)) e.peso = "Informe o peso em kg (ex: 72,5).";
		if (d.altura && (Number(d.altura) < 100 || Number(d.altura) > 230)) e.altura = "Informe a altura em centímetros (ex: 175).";
	}
	if (step === 2 && !d.objetivo) e.objetivo = "Selecione seu principal objetivo.";
	if (step === 3) {
		if (!d.treina) e.treina = "Informe se você treina atualmente.";
		if (!d.dias) e.dias = "Selecione quantos dias por semana consegue treinar.";
	}
	if (step === 4) {
		if (!d.alimentacao) e.alimentacao = "Selecione como avalia sua alimentação.";
		if (!d.rotina.trim()) e.rotina = "Descreva brevemente sua rotina.";
	}
	if (step === 5) {
		const digits = d.whatsapp.replace(/\D/g, "");
		if (!digits) e.whatsapp = "Informe seu WhatsApp.";
		else if (digits.length < 10 || digits.length > 13) e.whatsapp = "Informe o número com DDD, ex: (48) 99999-9999.";
	}
	return e;
}
var inputClass = "w-full bg-transparent border-b border-line focus:border-gold outline-none py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-none aria-[invalid=true]:border-destructive";
function Field({ id, label, optional, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: id,
			className: "block text-[11px] tracking-[0.2em] uppercase text-gold-soft mb-2",
			children: [label, optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 normal-case tracking-normal text-muted-foreground",
				children: "(opcional)"
			})]
		}),
		children,
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: `${id}-erro`,
			role: "alert",
			className: "mt-2 text-[13px] text-destructive",
			children: error
		})
	] });
}
function OptionGroup({ id, options, value, onChange, cols = 2 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id,
		role: "radiogroup",
		className: `grid gap-3 ${cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"}`,
		children: options.map((opt) => {
			const sel = value === opt;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": sel,
				onClick: () => onChange(opt),
				className: `flex items-center gap-3 text-left border px-4 py-4 min-h-[56px] transition-colors ${sel ? "border-gold bg-gold/5 text-foreground" : "border-line text-muted-foreground hover:border-gold/50"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `size-4 shrink-0 rounded-full border grid place-items-center ${sel ? "border-gold" : "border-line"}`,
					children: sel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-gold" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[15px]",
					children: opt
				})]
			}, opt);
		})
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] tracking-[0.28em] uppercase text-gold mb-5",
		children
	});
}
function Index() {
	const [step, setStep] = (0, import_react.useState)(1);
	const [data, setData] = (0, import_react.useState)(EMPTY);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const formTop = (0, import_react.useRef)(null);
	const set = (key, value) => {
		setData((d) => ({
			...d,
			[key]: value
		}));
		if (errors[key]) setErrors((e) => ({
			...e,
			[key]: void 0
		}));
	};
	const scrollToForm = () => formTop.current?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
	const goTo = (n) => {
		setErrors({});
		setStep(n);
		scrollToForm();
	};
	const next = () => {
		const e = validateStep(step, data);
		setErrors(e);
		const first = Object.keys(e)[0];
		if (first) {
			document.getElementById(`f-${first}`)?.focus();
			return;
		}
		goTo(step + 1);
	};
	const enviar = async () => {
		const e = validateStep(5, data);
		setErrors(e);
		if (Object.keys(e).length) {
			document.getElementById("f-whatsapp")?.focus();
			return;
		}
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			setStatus("error");
			return;
		}
		setStatus("sending");
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 25e3);
		try {
			const res = await fetch(PLANILHA_URL, {
				method: "POST",
				headers: { "Content-Type": "text/plain;charset=utf-8" },
				body: JSON.stringify(data),
				signal: ctrl.signal
			});
			const text = await res.text().catch(() => "");
			const failed = !res.ok || /"(result|status)"\s*:\s*"(error|erro)"/i.test(text);
			setStatus(failed ? "error" : "confirmed");
		} catch {
			setStatus("unconfirmed");
		} finally {
			clearTimeout(timer);
			scrollToForm();
		}
	};
	const reviewRows = [
		["Nome", data.nome],
		["Idade", data.idade],
		["Sexo", data.sexo],
		["Peso", data.peso ? `${data.peso} kg` : "—"],
		["Altura", data.altura ? `${data.altura} cm` : "—"],
		["Objetivo", data.objetivo],
		["Mudança", data.mudanca || "—"],
		["Treina", data.treina],
		["Experiência", data.experiencia || "—"],
		["Dias", data.dias],
		["Alimentação", data.alimentacao],
		["Rotina", data.rotina],
		["Dificuldade", data.dificuldade || "—"]
	];
	const done = status === "confirmed" || status === "unconfirmed";
	const inv = (k) => ({
		id: `f-${k}`,
		"aria-invalid": !!errors[k],
		...errors[k] ? { "aria-describedby": `f-${k}-erro` } : {}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-ink text-foreground font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-5 lg:px-10 h-16 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#inicio",
						className: "text-gold tracking-[0.28em] text-[12px] uppercase font-medium",
						children: "Matheus Delalibera"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#consultoria",
								className: "hidden md:inline hover:text-gold transition-colors",
								children: "Consultoria"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#resultados",
								className: "hidden md:inline hover:text-gold transition-colors",
								children: "Resultados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#como-funciona",
								className: "hidden md:inline hover:text-gold transition-colors",
								children: "Como funciona"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#pre-selecao",
								className: "text-gold border border-gold/60 px-4 py-2 hover:bg-gold hover:text-ink transition-colors",
								children: "Pré-seleção"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "inicio",
					className: "border-b border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 lg:px-10 py-20 sm:py-28 lg:py-36",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Consultoria de musculação" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif font-medium text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl max-w-[16ch] text-balance",
								children: "Treino com método, constância e direção."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 max-w-[52ch] text-muted-foreground text-[17px] leading-relaxed",
								children: "Acompanhamento individual com Matheus Delalibera, pensado a partir do seu objetivo e da rotina que você tem hoje. O primeiro passo é uma pré-seleção rápida."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 flex flex-col sm:flex-row sm:items-center gap-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#pre-selecao",
									className: "inline-flex justify-center bg-gold text-ink px-8 py-4 text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-gold-soft transition-colors",
									children: "Fazer pré-seleção"
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "consultoria",
					className: "border-b border-line scroll-mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "A consultoria" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-4xl sm:text-5xl font-medium leading-[1.05] text-balance",
								children: "Um plano que faz sentido para você."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-muted-foreground leading-relaxed",
								children: "O propósito do acompanhamento é tirar o improviso do treino: saber o que fazer, por que fazer e como ajustar ao longo do caminho."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "divide-y divide-line border-y border-line",
							children: [
								["Treino individualizado", "Divisão, exercícios e volume definidos a partir do seu objetivo, nível de experiência e dias disponíveis."],
								["Organização da rotina", "O planejamento considera trabalho, estudos e horários reais, para que seja possível manter no dia a dia."],
								["Ajustes ao longo do processo", "O plano é revisado conforme a sua evolução, em vez de repetir a mesma ficha por meses."],
								["Clareza na execução", "Orientações objetivas para treinar com mais segurança e saber exatamente o que fazer em cada sessão."]
							].map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid grid-cols-[2.5rem_1fr] gap-4 py-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-xl text-gold",
									children: String(i + 1).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[17px] text-foreground",
									children: t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[15px] text-muted-foreground leading-relaxed",
									children: d
								})] })]
							}, t))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "resultados",
					className: "border-b border-line scroll-mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 lg:px-10 py-20 lg:py-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Resultados de alunos" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-4xl sm:text-5xl font-medium leading-[1.05]",
									children: "Antes e depois."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-muted-foreground leading-relaxed",
									children: "Registros de alunos acompanhados. Cada processo é individual e os resultados variam de pessoa para pessoa."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-px bg-line border border-line",
									children: ["Antes", "Depois"].map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative aspect-[3/4] overflow-hidden bg-panel",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: index === 0 ? "/antes.jpg" : "/depois.jpg", alt: index === 0 ? "Foto antes da transformação" : "Foto depois da transformação", style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-gold-soft bg-ink/80 px-2 py-1",
											children: label
										})]
									}, label))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
									className: "mt-4 text-[12px] text-muted-foreground",
									children: "Evolução individual. Os resultados variam de pessoa para pessoa."
								})] })
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "como-funciona",
					className: "border-b border-line scroll-mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 lg:px-10 py-20 lg:py-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Como funciona a pré-seleção" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-4xl sm:text-5xl font-medium leading-[1.05] max-w-[18ch]",
								children: "Antes de começar, entender o seu momento."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-14 grid md:grid-cols-3 gap-px bg-line border border-line",
								children: [
									["Responda", "Perguntas sobre seus objetivos, sua experiência com treino e sua rotina. Leva poucos minutos."],
									["Avaliação", "O Matheus analisa as respostas para entender se a consultoria é adequada para o seu caso."],
									["Retorno", "Se houver encaixe, o contato é feito pelo WhatsApp informado. O envio não garante uma vaga."]
								].map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-ink p-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] tracking-[0.2em] text-gold",
											children: ["ETAPA ", i + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-4 font-serif text-2xl",
											children: t
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-[15px] text-muted-foreground leading-relaxed",
											children: d
										})
									]
								}, t))
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "pre-selecao",
					className: "scroll-mt-16 bg-panel/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: formTop,
						className: "scroll-mt-16"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl px-5 lg:px-10 py-20 lg:py-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Formulário de pré-seleção" }),
							!done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: STEPS[step - 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Etapa ",
										step,
										" de ",
										STEPS.length
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-1.5",
									"aria-hidden": true,
									children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-[3px] transition-colors ${i < step ? "bg-gold" : "bg-line"}` }, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "anim-fade",
								children: [
									!done && step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeading, {
											title: "Vamos começar por você.",
											description: "Algumas informações básicas para entender seu contexto."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 space-y-8",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-nome",
													label: "Nome completo",
													error: errors.nome,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														...inv("nome"),
														type: "text",
														autoComplete: "name",
														value: data.nome,
														onChange: (e) => set("nome", e.target.value),
														placeholder: "Seu nome",
														className: inputClass
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid sm:grid-cols-2 gap-8",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														id: "f-idade",
														label: "Idade",
														error: errors.idade,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															...inv("idade"),
															type: "number",
															inputMode: "numeric",
															value: data.idade,
															onChange: (e) => set("idade", e.target.value),
															placeholder: "Ex: 25",
															className: inputClass
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														id: "f-sexo",
														label: "Sexo",
														error: errors.sexo,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															...inv("sexo"),
															value: data.sexo,
															onChange: (e) => set("sexo", e.target.value),
															className: `${inputClass} bg-ink`,
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "",
																	children: "Selecione"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Masculino" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Feminino" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Outro" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Prefiro não informar" })
															]
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-8",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														id: "f-peso",
														label: "Peso (kg)",
														optional: true,
														error: errors.peso,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															...inv("peso"),
															type: "number",
															inputMode: "decimal",
															step: "0.1",
															value: data.peso,
															onChange: (e) => set("peso", e.target.value),
															placeholder: "72,5",
															className: inputClass
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														id: "f-altura",
														label: "Altura (cm)",
														optional: true,
														error: errors.altura,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															...inv("altura"),
															type: "number",
															inputMode: "numeric",
															value: data.altura,
															onChange: (e) => set("altura", e.target.value),
															placeholder: "175",
															className: inputClass
														})
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, { onNext: next })
									] }),
									!done && step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeading, {
											title: "O que você quer alcançar?",
											description: "Escolha o objetivo que melhor representa o que você procura."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 space-y-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												id: "f-objetivo",
												label: "Principal objetivo",
												error: errors.objetivo,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGroup, {
													id: "f-objetivo",
													options: [
														"Ganhar massa muscular",
														"Perder gordura",
														"Recomposição corporal",
														"Performance e evolução"
													],
													value: data.objetivo,
													onChange: (v) => set("objetivo", v)
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												id: "f-mudanca",
												label: "O que você mais gostaria de mudar?",
												optional: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													id: "f-mudanca",
													value: data.mudanca,
													onChange: (e) => set("mudanca", e.target.value),
													placeholder: "Conte com suas palavras.",
													rows: 3,
													className: `${inputClass} resize-none`
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
											onBack: () => goTo(1),
											onNext: next
										})
									] }),
									!done && step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeading, {
											title: "Como está seu treino hoje?",
											description: "Não importa se você está começando ou já treina há anos."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 space-y-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												id: "f-treina",
												label: "Você treina musculação atualmente?",
												error: errors.treina,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGroup, {
													id: "f-treina",
													cols: 1,
													options: ["Sim", "Não"],
													value: data.treina,
													onChange: (v) => set("treina", v)
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid sm:grid-cols-2 gap-8",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-experiencia",
													label: "Há quanto tempo treina?",
													optional: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														id: "f-experiencia",
														value: data.experiencia,
														onChange: (e) => set("experiencia", e.target.value),
														className: `${inputClass} bg-ink`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "",
																children: "Selecione"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Estou começando" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Menos de 6 meses" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "6 meses a 1 ano" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "1 a 2 anos" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mais de 2 anos" })
														]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-dias",
													label: "Dias por semana disponíveis",
													error: errors.dias,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														...inv("dias"),
														value: data.dias,
														onChange: (e) => set("dias", e.target.value),
														className: `${inputClass} bg-ink`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "",
																children: "Selecione"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "2 dias" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "3 dias" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "4 dias" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "5 dias" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "6 dias" })
														]
													})
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
											onBack: () => goTo(2),
											onNext: next
										})
									] }),
									!done && step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeading, {
											title: "Sua rotina também importa.",
											description: "O planejamento precisa caber na vida real."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 space-y-8",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-alimentacao",
													label: "Como avalia sua alimentação?",
													error: errors.alimentacao,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														...inv("alimentacao"),
														value: data.alimentacao,
														onChange: (e) => set("alimentacao", e.target.value),
														className: `${inputClass} bg-ink`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "",
																children: "Selecione"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Precisa melhorar bastante" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Razoável" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Boa" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Muito boa" })
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-rotina",
													label: "Como é sua rotina?",
													error: errors.rotina,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
														...inv("rotina"),
														value: data.rotina,
														onChange: (e) => set("rotina", e.target.value),
														placeholder: "Trabalho, estudos, horários, refeições, disponibilidade...",
														rows: 4,
														className: `${inputClass} resize-none`
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-dificuldade",
													label: "O que mais dificulta sua evolução?",
													optional: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
														id: "f-dificuldade",
														value: data.dificuldade,
														onChange: (e) => set("dificuldade", e.target.value),
														placeholder: "Ex: constância, tempo, alimentação, organização...",
														rows: 3,
														className: `${inputClass} resize-none`
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
											onBack: () => goTo(3),
											onNext: next
										})
									] }),
									!done && step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeading, {
											title: "Só falta o seu contato.",
											description: "Confira suas respostas e informe um WhatsApp para retorno."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 space-y-10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													id: "f-whatsapp",
													label: "WhatsApp com DDD",
													error: errors.whatsapp,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														...inv("whatsapp"),
														type: "tel",
														inputMode: "tel",
														autoComplete: "tel",
														value: data.whatsapp,
														onChange: (e) => set("whatsapp", e.target.value),
														placeholder: "(48) 99999-9999",
														className: inputClass
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
													className: "divide-y divide-line border-y border-line",
													children: reviewRows.map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-4 py-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
															className: "text-[11px] tracking-[0.16em] uppercase text-gold-soft pt-0.5",
															children: l
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
															className: "text-[14px] text-foreground/90 whitespace-pre-line break-words",
															children: v
														})]
													}, l))
												}),
												status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													role: "alert",
													className: "border border-destructive/60 p-5 text-[14px] leading-relaxed",
													children: "Não foi possível enviar suas respostas agora. Verifique sua conexão e tente novamente. Suas respostas continuam preenchidas."
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
											onBack: () => goTo(4),
											onNext: enviar,
											nextLabel: status === "sending" ? "Enviando..." : status === "error" ? "Tentar novamente" : "Enviar pré-seleção",
											nextDisabled: status === "sending"
										})
									] }),
									status === "confirmed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-12 grid place-items-center border border-gold text-gold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, {})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-8 font-serif text-4xl sm:text-5xl font-medium leading-[1.05]",
											children: "Respostas recebidas."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-6 text-muted-foreground leading-relaxed max-w-[52ch]",
											children: "Suas respostas foram registradas e serão avaliadas pelo Matheus. Caso haja encaixe, o contato será feito pelo WhatsApp informado."
										})
									] }),
									status === "unconfirmed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-serif text-4xl sm:text-5xl font-medium leading-[1.05]",
											children: "Envio realizado."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-6 text-muted-foreground leading-relaxed max-w-[56ch]",
											children: "Suas respostas foram enviadas, mas não conseguimos confirmar o recebimento automaticamente. Se quiser garantir, avise o Matheus pelo WhatsApp que você preencheu a pré-seleção."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `${WHATSAPP_URL}?text=${encodeURIComponent(`Olá, Matheus! Sou ${data.nome} e acabei de preencher a pré-seleção da consultoria.`)}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "mt-8 inline-flex border border-gold/60 text-gold px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-gold hover:text-ink transition-colors",
											children: "Avisar pelo WhatsApp"
										})
									] })
								]
							}, done ? status : step)
						]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-5 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 Matheus Cardoso Delalibera. Todos os direitos reservados." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-6 tracking-[0.14em] uppercase text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: INSTAGRAM_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hover:text-gold transition-colors",
							children: "Instagram"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: WHATSAPP_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hover:text-gold transition-colors",
							children: "WhatsApp"
						})]
					})]
				})
			})
		]
	});
}
function CheckIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12.5l4.5 4.5L19 7.5" })
	});
}
function StepHeading({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-muted-foreground leading-relaxed max-w-[52ch]",
		children: description
	})] });
}
function Nav({ onBack, onNext, nextLabel = "Continuar", nextDisabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 flex items-center gap-4 border-t border-line pt-8",
		children: [onBack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onBack,
			className: "py-3 text-[12px] tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors",
			children: "Voltar"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onNext,
			disabled: nextDisabled,
			className: "ml-auto bg-gold text-ink px-8 py-4 text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-gold-soft transition-colors disabled:opacity-50",
			children: nextLabel
		})]
	});
}
//#endregion
export { Index as component, validateStep };
