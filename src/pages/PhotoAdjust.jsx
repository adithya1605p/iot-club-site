/**
 * DEV ONLY — Photo Crop Adjuster
 * Visit http://localhost:5173/photo-adjust
 * Drag sliders to set the exact objectPosition for each advisory photo.
 * Positions are saved to localStorage and automatically read by Team.jsx
 */
import { useState, useEffect } from 'react';
import { advisoryBatches } from '../data/team';
import { Copy, Check, RotateCcw } from 'lucide-react';

const LS_KEY = 'advisory_photo_positions';

const loadPositions = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
};

const PhotoAdjust = () => {
    const allMembers = advisoryBatches.flatMap(b => b.members);
    const [positions, setPositions] = useState(loadPositions);
    const [copied, setCopied] = useState(false);

    // persist on every change
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(positions));
    }, [positions]);

    const getPos = (id) => positions[id] || { x: 50, y: 30 };

    const setPos = (id, axis, val) => {
        setPositions(prev => ({
            ...prev,
            [id]: { ...getPos(id), [axis]: Number(val) }
        }));
    };

    const reset = (id) => {
        setPositions(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const copyAll = () => {
        const out = JSON.stringify(positions, null, 2);
        navigator.clipboard.writeText(out);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: '#05070a', minHeight: '100vh', padding: '80px 24px 60px', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ display: 'inline-block', background: '#ff4444', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 4, padding: '4px 12px', borderRadius: 4, marginBottom: 12 }}>
                    DEV ONLY — NOT VISIBLE IN PROD
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '8px 0 4px' }}>Photo Crop Adjuster</h1>
                <p style={{ color: '#6b7280', fontSize: 14 }}>
                    Use the X / Y sliders to reposition each image inside its circle.<br />
                    Changes save automatically — just refresh Team page to see them live.
                </p>
                <button
                    onClick={copyAll}
                    style={{
                        marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: copied ? '#16a34a' : '#2b6cee', color: '#fff',
                        border: 'none', borderRadius: 8, padding: '10px 20px',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    }}
                >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Copied to Clipboard!' : 'Copy All Positions (JSON)'}
                </button>
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24, maxWidth: 1400, margin: '0 auto' }}>
                {allMembers.map((member) => {
                    const { x, y } = getPos(member.id);
                    const objPos = `${x}% ${y}%`;
                    return (
                        <div key={member.id} style={{
                            background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 16, padding: 20, textAlign: 'center'
                        }}>
                            {/* Preview circle */}
                            <div style={{
                                width: 100, height: 100, borderRadius: '50%',
                                overflow: 'hidden', margin: '0 auto 12px',
                                border: '2px solid rgba(43,108,238,0.5)'
                            }}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    style={{
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: objPos,
                                        transform: member.rotate ? 'rotate(-90deg) scale(1.55)' : 'none',
                                    }}
                                />
                            </div>

                            {/* Name + role */}
                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{member.name}</div>
                            <div style={{ color: '#a855f7', fontSize: 11, marginBottom: 14 }}>{member.role}</div>

                            {/* Current values */}
                            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#ccff00', marginBottom: 12 }}>
                                {objPos}
                            </div>

                            {/* X slider */}
                            <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                                X (left ↔ right): {x}%
                            </label>
                            <input type="range" min={0} max={100} value={x}
                                onChange={e => setPos(member.id, 'x', e.target.value)}
                                style={{ width: '100%', marginBottom: 10, accentColor: '#2b6cee' }}
                            />

                            {/* Y slider */}
                            <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                                Y (top ↕ bottom): {y}%
                            </label>
                            <input type="range" min={0} max={100} value={y}
                                onChange={e => setPos(member.id, 'y', e.target.value)}
                                style={{ width: '100%', marginBottom: 14, accentColor: '#2b6cee' }}
                            />

                            {/* Reset */}
                            <button onClick={() => reset(member.id)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#6b7280', borderRadius: 6, padding: '5px 12px',
                                    fontSize: 11, cursor: 'pointer'
                                }}>
                                <RotateCcw size={11} /> Reset
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* How to apply note */}
            <div style={{
                maxWidth: 700, margin: '48px auto 0', padding: 20,
                background: '#0d1117', border: '1px solid rgba(204,255,0,0.2)', borderRadius: 12,
                fontSize: 13, color: '#9ca3af', lineHeight: 1.7
            }}>
                <strong style={{ color: '#ccff00' }}>How it works:</strong> Your adjustments are saved in <code style={{ color: '#fff' }}>localStorage</code> under the key <code style={{ color: '#fff' }}>advisory_photo_positions</code>. The Team page reads these automatically — just go to <a href="/team" style={{ color: '#2b6cee' }}>/team</a> to preview. When you're happy, click <strong>Copy All Positions</strong> and send me the JSON — I'll hardcode them.
            </div>
        </div>
    );
};

export default PhotoAdjust;
